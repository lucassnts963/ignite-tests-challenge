import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let inMemoryUsersRepository: InMemoryUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;

describe("Authenticate User", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(
      inMemoryUsersRepository
    );
  });

  it("should be able to authenticate a user", async () => {
    const user = await inMemoryUsersRepository.create({
      name: "John Doe",
      email: "sample@email.com",
      password: "123456",
    });

    console.log(user);

    const auth = await authenticateUserUseCase.execute({
      email: "sample@email.com",
      password: "123456",
    });

    console.log(auth);

    expect(auth).toHaveProperty("token");
    expect(auth).toHaveProperty("user");
    expect(auth.user).toHaveProperty("id");
  });

  it("should not be able to authenticate a user with a incorrect password", async () => {
    expect(async () => {
      await inMemoryUsersRepository.create({
        name: "John Doe",
        email: "sample@email.com",
        password: "password",
      });

      await authenticateUserUseCase.execute({
        email: "sample@email.com",
        password: "incorrect password",
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it("should not be able to authenticate a user with a incorrect email", async () => {
    expect(async () => {
      await inMemoryUsersRepository.create({
        name: "John Doe",
        email: "sample@email.com",
        password: "password",
      });

      await authenticateUserUseCase.execute({
        email: "wrong@email.com",
        password: "password",
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });
});
