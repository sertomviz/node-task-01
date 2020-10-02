import { Router } from 'express';
import { catchAsync } from "../middlewares/errors";
import zombiesController from '../controllers/zombiesController';
import getFilters from '../middlewares/filters/zombies';

export default () => {
    const api = Router();

    // GET /zombies/:id
    api.get('/:id', catchAsync(zombiesController.getOne));

    // GET /zombies
    api.get('/', getFilters, catchAsync(zombiesController.getAll));

    // POST /zombies
    api.post('/', catchAsync(zombiesController.create));

    // PUT /zombies/:id
    api.put('/:id', catchAsync(zombiesController.update));

    // DELETE /zombies/:id
    api.delete('/:id', catchAsync(zombiesController.remove));

    return api;
}
