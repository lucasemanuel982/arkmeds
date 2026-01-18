import { Request, Response } from "express";
import { DriverRepository } from "../../persistence/repositories/DriverRepository";
import { CreateDriver } from "../../../application/driver/use-cases/CreateDriver";
import { GetDriver } from "../../../application/driver/use-cases/GetDriver";
import { ListDrivers } from "../../../application/driver/use-cases/ListDrivers";
import { UpdateDriver } from "../../../application/driver/use-cases/UpdateDriver";
import { DeleteDriver } from "../../../application/driver/use-cases/DeleteDriver";

const repository = new DriverRepository();
const createDriver = new CreateDriver(repository);
const getDriver = new GetDriver(repository);
const listDrivers = new ListDrivers(repository);
const updateDriver = new UpdateDriver(repository);
const deleteDriver = new DeleteDriver(repository);

export async function create(req: Request, res: Response): Promise<void> {
  const driver = await createDriver.execute(req.body);
  res.status(201).json(driver);
}

export async function getById(req: Request, res: Response): Promise<void> {
  const driver = await getDriver.execute(req.params.id);
  res.status(200).json(driver);
}

export async function list(_req: Request, res: Response): Promise<void> {
  const drivers = await listDrivers.execute();
  res.status(200).json(drivers);
}

export async function update(req: Request, res: Response): Promise<void> {
  const driver = await updateDriver.execute(req.params.id, req.body);
  res.status(200).json(driver);
}

export async function remove(req: Request, res: Response): Promise<void> {
  await deleteDriver.execute(req.params.id);
  res.status(204).send();
}
