import { OperationType } from "../../entities/Statement";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceUseCase } from "./GetBalanceUseCase";
import { GetBalanceError } from "./GetBalanceError";

let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let getBalanceUseCase: GetBalanceUseCase;

describe("Get Balance", () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    getBalanceUseCase = new GetBalanceUseCase(
      inMemoryStatementsRepository,
      inMemoryUsersRepository
    );
  });

  it("should be able to get the balance", async () => {
    const user = await inMemoryUsersRepository.create({
      name: "John Doe",
      email: "sample@email.com",
      password: "123456",
    });

    await inMemoryStatementsRepository.create({
      user_id: String(user.id),
      amount: 1000,
      description: "Description sample",
      type: OperationType.DEPOSIT,
    });

    const { balance, statement } = await getBalanceUseCase.execute({
      user_id: String(user.id),
    });

    expect(balance).toBe(1000);
    expect(statement.length).toBe(1);
  });

  it("should not be able to get the balance", async () => {
    expect(async () => {
      await getBalanceUseCase.execute({
        user_id: "sample id",
      });
    }).rejects.toBeInstanceOf(GetBalanceError);
  });
});
