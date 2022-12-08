import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let inMemoryUserRepository: InMemoryUsersRepository;
let inMemoryStatementRepository: InMemoryStatementsRepository;
let getStatementOperationUseCase: GetStatementOperationUseCase;

describe("Get Statement Operation", () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUsersRepository();
    inMemoryStatementRepository = new InMemoryStatementsRepository();
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      inMemoryUserRepository,
      inMemoryStatementRepository
    );
  });

  it("should be able to get statement operation from a user", async () => {
    const user = await inMemoryUserRepository.create({
      name: "John Doe",
      email: "sample@email.com",
      password: "sample password",
    });

    const statement = await inMemoryStatementRepository.create({
      amount: 500,
      description: "description",
      type: OperationType.DEPOSIT,
      user_id: String(user.id),
    });

    const statementOperation = await getStatementOperationUseCase.execute({
      user_id: String(user.id),
      statement_id: String(statement.id),
    });

    expect(statementOperation).toHaveProperty("id");
    expect(statementOperation.amount).toBe(statement.amount);
  });

  it("should not be able to get statement operation from a not exists user", async () => {
    expect(async () => {
      const user = await inMemoryUserRepository.create({
        name: "John Doe",
        email: "sample@email.com",
        password: "sample password",
      });

      const statement = await inMemoryStatementRepository.create({
        amount: 500,
        description: "description",
        type: OperationType.DEPOSIT,
        user_id: String(user.id),
      });

      await getStatementOperationUseCase.execute({
        user_id: "123456",
        statement_id: String(statement.id),
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  });

  it("should not be able to get statement operation from a not exists statement", async () => {
    expect(async () => {
      const user = await inMemoryUserRepository.create({
        name: "John Doe",
        email: "sample@email.com",
        password: "sample password",
      });

      await getStatementOperationUseCase.execute({
        user_id: String(user.id),
        statement_id: "4234235",
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  });
});
