import { Router } from 'express';
import { catchAsync } from "../middlewares/errors";
import zombiesController from '../controllers/zombiesController';
import getFilters from '../middlewares/filters/zombies';

export default () => {
    const api = Router();

    /**
    * @swagger
    * /api/zombies/{id}:
    *   get:
    *     summary: Get one zombie
    *     description: Use to request a zombie by id
    *     parameters:
    *         - name: id
    *           description: id to get by
    *           in: path
    *           type: string
    *           required: true
    *     responses:
    *          '200':
    *             description: A succesfull response
    *          '204':
    *             description: Data not found
    */
    api.get('/:id', catchAsync(zombiesController.getOne));

    /**
    * @swagger
    * /api/zombies:
    *   get:
    *     summary: Get all zombies
    *     description: Use to request all zombies
    *     responses:
    *          '200':
    *             description: A succesfull response
    */
    api.get('/', getFilters, catchAsync(zombiesController.getAll));

    /**
    * @swagger
    * /api/zombies:
    *   post:
    *     summary: Create zombie
    *     description: Use to create a zombie with request body
    *     parameters:
    *         - name: body
    *           description: request body
    *           in: body
    *           schema:
    *             type: object
    *             properties:
    *               name:
    *                 type: string
    *               items:
    *                 type: array
    *                 items:
    *                   type: integer
    *             example:
    *               name: Suzan
    *               items: [2,3,4,5]
    *             required:
    *                 - name
    *     responses:
    *         '201':
    *             description: A succesfull response
    *         '400':
    *             description: Bad request
    */
    api.post('/', catchAsync(zombiesController.create));

    /**
    * @swagger
    * /api/zombies/{id}:
    *   patch:
    *     summary: Update zombie
    *     description: Use to update a zombie with request body
    *     parameters:
    *         - name: id
    *           description: id to update
    *           in: path
    *           type: string
    *           required: true
    *         - name: body
    *           description: request body
    *           in: body
    *           schema:
    *             type: object
    *             properties:
    *               name:
    *                 type: string
    *               items:
    *                 type: array
    *                 items:
    *                   type: integer
    *             example:
    *               name: Suzan
    *               items: [2,3,4,5]
    *             required:
    *                 - name
    *     responses:
    *         '200':
    *             description: A succesfull response
    *         '204':
    *             description: Data not found
    *         '400':
    *             description: Bad request
    */
    api.patch('/:id', catchAsync(zombiesController.update));

    /**
    * @swagger
    * /api/zombies/{id}:
    *   delete:
    *     summary: Delete zombie
    *     description: Use to delete a zombie by id
    *     parameters:
    *         - name: id
    *           description: id to delete
    *           in: path
    *           type: string
    *           required: true
    *     responses:
    *         '200':
    *             description: A succesfull response
    *         '204':
    *             description: Data not found
    */
    api.delete('/:id', catchAsync(zombiesController.remove));

    return api;
}
