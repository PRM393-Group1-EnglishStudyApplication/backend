import { Router } from 'express';
import { getUnitsByCourse, postUnit, putUnit, removeUnit } from './controller.js';

export const unitsRouter = Router();
export const courseUnitsRouter = Router({ mergeParams: true });

courseUnitsRouter.get('/', getUnitsByCourse);

unitsRouter.post('/', postUnit);
unitsRouter.put('/:id', putUnit);
unitsRouter.delete('/:id', removeUnit);
