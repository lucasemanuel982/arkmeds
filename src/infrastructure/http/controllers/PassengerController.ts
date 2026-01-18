import { Request, Response } from "express";
import { PassengerRepository } from "../../persistence/repositories/PassengerRepository";
import { CreatePassenger } from "../../../application/passenger/use-cases/CreatePassenger";
import { GetPassenger } from "../../../application/passenger/use-cases/GetPassenger";
import { ListPassengers } from "../../../application/passenger/use-cases/ListPassengers";
import { UpdatePassenger } from "../../../application/passenger/use-cases/UpdatePassenger";
import { DeletePassenger } from "../../../application/passenger/use-cases/DeletePassenger";

const repository = new PassengerRepository();
const createPassenger = new CreatePassenger(repository);
const getPassenger = new GetPassenger(repository);
const listPassengers = new ListPassengers(repository);
const updatePassenger = new UpdatePassenger(repository);
const deletePassenger = new DeletePassenger(repository);

export async function create(req: Request, res: Response): Promise<void> {
  const passenger = await createPassenger.execute(req.body);
  res.status(201).json(passenger);
}

export async function getById(req: Request, res: Response): Promise<void> {
  const passenger = await getPassenger.execute(req.params.id);
  res.status(200).json(passenger);
}

export async function list(_req: Request, res: Response): Promise<void> {
  const passengers = await listPassengers.execute();
  res.status(200).json(passengers);
}

export async function update(req: Request, res: Response): Promise<void> {
  const passenger = await updatePassenger.execute(req.params.id, req.body);
  res.status(200).json(passenger);
}

export async function remove(req: Request, res: Response): Promise<void> {
  await deletePassenger.execute(req.params.id);
  res.status(204).send();
}
