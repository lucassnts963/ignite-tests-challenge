import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

let createStatementUseCase: CreateStatementUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementRepository: InMemoryStatementsRepository;

describe("Create a new Statement", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementRepository
    );
  });

  it("should be able to create a new statement as a deposit", async () => {
    const user = await inMemoryUsersRepository.create({
      email: "name@email.com",
      name: "Sample Name",
      password: "123456",
    });

    const statement = await createStatementUseCase.execute({
      amount: 1000,
      description: "Salary",
      type: OperationType.DEPOSIT,
      user_id: String(user.id),
    });

    expect(statement).toHaveProperty("id");
  });

  it("should be able to create a new statement as a withdraw", async () => {
    const user = await inMemoryUsersRepository.create({
      email: "name@email.com",
      name: "Sample Name",
      password: "123456",
    });

    await createStatementUseCase.execute({
      amount: 1000,
      description: "Salary",
      type: OperationType.DEPOSIT,
      user_id: String(user.id),
    });

    const statement = await createStatementUseCase.execute({
      amount: 500,
      description: "Payment Credit Card",
      type: OperationType.WITHDRAW,
      user_id: String(user.id),
    });

    expect(statement).toHaveProperty("id");
  });

  it("should not be able to create a new statement, because there are not a user", async () => {
    expect(async () => {
      await createStatementUseCase.execute({
        amount: 1000,
        description: "Salary",
        type: OperationType.DEPOSIT,
        user_id: "id sample",
      });
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });

  it("should not be able to create a new statement, because there are not sufficient funds", async () => {
    expect(async () => {
      const user = await inMemoryUsersRepository.create({
        email: "name@email.com",
        name: "Sample Name",
        password: "123456",
      });

      await createStatementUseCase.execute({
        amount: 500,
        description: "Payment Credit Card",
        type: OperationType.WITHDRAW,
        user_id: String(user.id),
      });
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  });
});
