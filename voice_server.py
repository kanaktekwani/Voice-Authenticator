#!/usr/bin/env python3
from flask import Flask, jsonify, Response, request
from flask_cors import CORS
import threading, time, random, json, logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Flask app setup
app = Flask(__name__)
#CORS(app, origins="*", methods=["GET", "OPTIONS"], allow_headers=["Accept", "Cache-Control"])
CORS(app)
# Rolling window of the last 3 probabilities
latest_probs = []
THRESHOLD = 0.4
server_start_time = time.time()


def simulate_realtime_probs():
    """Background thread: generate one new random probability per second."""
    logger.info("🔄 Starting probability simulation thread...")
    
    while True:
        try:
            prob = random.random()
            latest_probs.append(prob)
            if len(latest_probs) > 3:
                latest_probs.pop(0)
            
            logger.debug(f"Generated prob: {prob:.3f}, window: {[f'{p:.3f}' for p in latest_probs]}")
            time.sleep(1)
            
        except Exception as e:
            logger.error(f"Error in simulation thread: {e}")
            time.sleep(1)


@app.route("/api/status")
def latest_status():
    """One-shot JSON endpoint returning current status & probability window."""
    try:
        status = (
            "human"
            if len(latest_probs) == 3 and all(p > THRESHOLD for p in latest_probs)
            else "uncertain"
        )
        
        response_data = {
            "status": status, 
            "probs": latest_probs,
            "speakerUUID": "test-uuid-1234",  # TEMP placeholder
            "timestamp": time.time(),
            "uptime": time.time() - server_start_time
        }
        
        logger.info(f"📊 Status request: {status}, probs: {[f'{p:.3f}' for p in latest_probs]}")
        return jsonify(response_data)
        
    except Exception as e:
        logger.error(f"Error in /api/status: {e}")
        return jsonify({"error": str(e)}), 500


@app.route("/stream")
def stream():
    """SSE endpoint: streams JSON {status, probs} every second."""
    logger.info(f"🌊 New SSE client connected: {request.remote_addr}")
    
    def event_stream():
        client_start = time.time()
        message_count = 0
        
        try:
            while True:
                status = (
                    "human"
                    if len(latest_probs) == 3 and all(p > THRESHOLD for p in latest_probs)
                    else "uncertain"
                )
                
                payload = {
                    "status": status, 
                    "probs": latest_probs,
                    "timestamp": time.time(),
                    "message_count": message_count
                }
                
                data_line = f"data: {json.dumps(payload)}\n\n"
                
                logger.debug(f"📡 SSE message {message_count}: {status}")
                yield data_line
                
                message_count += 1
                time.sleep(1)
                
        except GeneratorExit:
            logger.info(f"🔌 SSE client disconnected after {time.time() - client_start:.1f}s, {message_count} messages")
        except Exception as e:
            logger.error(f"Error in SSE stream: {e}")
            yield f"data: {json.dumps({'error': str(e)})}\n\n"

    response = Response(
        event_stream(), 
        mimetype="text/event-stream",
        headers={
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Accept, Cache-Control'
        }
    )
    
    return response


@app.route("/health")
def health_check():
    """Health check endpoint."""
    return jsonify({
        "status": "healthy",
        "uptime": time.time() - server_start_time,
        "prob_window_size": len(latest_probs),
        "latest_probs": latest_probs
    })


@app.before_request
def log_request():
    """Log all incoming requests."""
    logger.info(f"📥 {request.method} {request.path} from {request.remote_addr}")


@app.after_request
def log_response(response):
    """Log all outgoing responses."""
    logger.debug(f"📤 {response.status_code} for {request.method} {request.path}")
    return response


if __name__ == "__main__":
    print("=" * 60)
    print("🔊 Voice Prediction Server Starting...")
    print("=" * 60)
    print(f"📡 SSE Endpoint: http://0.0.0.0:5000/stream")
    print(f"📊 Status API:   http://0.0.0.0:5000/api/status")
    print(f"🏥 Health Check: http://0.0.0.0:5000/health")
    print("=" * 60)
    
    # Start simulator thread before launching server
    sim_thread = threading.Thread(target=simulate_realtime_probs, daemon=True)
    sim_thread.start()
    
    # Give thread a moment to start
    time.sleep(0.5)
    
    try:
        app.run(host="0.0.0.0", port=5000, debug=True, threaded=True)
    except KeyboardInterrupt:
        logger.info("🛑 Server stopped by user")
    except Exception as e:
        logger.error(f"💥 Server error: {e}")
        raise