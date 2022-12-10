import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe("Show the User Profile", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(
      inMemoryUsersRepository
    );
  });

  it("should be able to show the user profile", async () => {
    const user = await inMemoryUsersRepository.create({
      name: "sample",
      email: "sample@email.com",
      password: "123456",
    });

    const profile = await showUserProfileUseCase.execute(String(user.id));

    expect(profile).toHaveProperty("id");
    expect(profile.name).toEqual("sample");
  });

  it("should not be able to show the user profile", () => {
    expect(async () => {
      await showUserProfileUseCase.execute("sample id");
    }).rejects.toBeInstanceOf(ShowUserProfileError);
  });
});
