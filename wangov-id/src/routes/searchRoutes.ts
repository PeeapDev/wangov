import express from 'express';
import searchController from '../controllers/searchController';
import { authenticateJWT } from '../middleware/auth';

const router = express.Router();

/**
 * @route POST /api/search
 * @desc Search across all indexed data
 * @access Public with role-based content filtering
 */
router.post('/', authenticateJWT, searchController.search);

/**
 * @route GET /api/search/suggestions
 * @desc Get autocomplete suggestions
 * @access Public
 */
router.get('/suggestions', searchController.getSuggestions);

/**
 * @route GET /api/search/nin/:nin
 * @desc Search for citizen by NIN
 * @access Restricted (admin, organization admin)
 */
router.get('/nin/:nin', authenticateJWT, searchController.searchByNIN);

/**
 * @route POST /api/search/role
 * @desc Role-based search with automatic filtering
 * @access Authenticated
 */
router.post('/role', authenticateJWT, searchController.roleSearch);

/**
 * @route GET /api/search/health
 * @desc Check search service health
 * @access Admin
 */
router.get('/health', authenticateJWT, searchController.healthCheck);

export default router;
