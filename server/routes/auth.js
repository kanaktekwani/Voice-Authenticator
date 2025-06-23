import express from 'express';
import { query } from 'express-validator';

import { handleError, sanitize } from '../helpers/routing.js';
import { getDeeplink, getToken } from '../helpers/zoom-api.js';
import { getZoomUser } from '../helpers/zoom-api.js';
import ZoomUser from '../models/ZoomUser.js';


import session from '../session.js';

const router = express.Router();

const codeMin = 32;
const codeMax = 64;

// Validate the Authorization Code sent from Zoom
const validateQuery = [
    query('code')
        .isString()
        .withMessage('code must be a string')
        .isLength({ min: codeMin, max: codeMax })
        .withMessage(`code must be > ${codeMin} and < ${codeMax} chars`)
        .escape(),
    query('state')
        .isString()
        .withMessage('state must be a string')
        .custom((value, { req }) => value === req.session.state)
        .withMessage('invalid state parameter')
        .escape(),
];


/*
 * Redirect URI - Zoom App Launch handler
 * The user is redirected to this route when they authorize your app
 */
router.get('/', session, validateQuery, async (req, res, next) => {
    req.session.state = null;

    try {
        // sanitize code and state query parameters
        sanitize(req);

        const code = req.query.code;
        const verifier = req.session.verifier;

        req.session.verifier = null;

        // get Access Token from Zoom
        const { access_token: accessToken, refresh_token, expires_in } = await getToken(code, verifier);

        req.session.accessToken = accessToken;
        console.log('🔑 Access Token:', accessToken);
        console.log('🔄 Refresh Token:', refresh_token);
        console.log('⏰ Expires In (seconds):', expires_in);
        //const zoomUser = await getZoomUser('me', accessToken);
        // 🔍 Fetch Zoom user info
        const zoomUser = await getZoomUser('me', accessToken);

        // 💾 Store in session (optional but useful)
        req.session.userId = zoomUser.id;

        // 🧾 Log user info
        console.log('✅ Zoom User ID:', zoomUser.id);
        console.log('📧 Email:', zoomUser.email);

        // 💾 Save to DB
        await ZoomUser.findOneAndUpdate(
        { zoomUserId: zoomUser.id },
        { email: zoomUser.email },
        { upsert: true, new: true }
        );

        // fetch deeplink from Zoom API
        const deeplink = await getDeeplink(accessToken);

        // redirect the user to the Zoom Client
        res.redirect(deeplink);
    } catch (e) {
        next(handleError(e));
    }
});

router.get('/session-info', (req, res) => {
    const token = req.session?.accessToken;
    if (!token) {
        return res.status(401).json({ error: 'No access token in session' });
    }

    const userId = req.session?.userId || null;
    const paid = req.session?.hasPaidPlan || false;

    return res.json({ userId, paid });
});

export default router;
