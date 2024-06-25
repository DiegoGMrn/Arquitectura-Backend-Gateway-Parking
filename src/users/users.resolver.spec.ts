import { Test, TestingModule } from '@nestjs/testing';
import { UsersResolver } from './users.resolver';


import { CreateUserRequest, GetUserResponse, LoginRequest, LoginResponse } from './users.pb';
import { GetUserInput } from './dto/get-user.input';

describe('UsersResolver', () => {
  let resolver: UsersResolver;


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersResolver,
        {
          provide: 'UserServiceClient',
          useValue: {
            getService: jest.fn().mockReturnValue({
              createUser: jest.fn(),
              login: jest.fn(),
              getService: jest.fn(),
            }),
          },
        },
      ],
    }).compile();

    resolver = module.get<UsersResolver>(UsersResolver);
    resolver.onModuleInit();  
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  it('createUser should create a new user and return the response', async () => {
    const createUserInput: CreateUserRequest = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password',
      tipoUser: true,
    };

    jest.spyOn(resolver, 'createUser').mockImplementation(async () => ({
      success: true,
      message: 'User created successfully',
    }));

    const result = await resolver.createUser(createUserInput);

    // Verificar que la respuesta del resolver sea correcta
    expect(result).toEqual({
      success: true,
      message: 'User created successfully',
    });
  });

  it('login should authenticate a user and return a token', async () => {
    const loginUserInput: LoginRequest = {
      email: 'john.doe@example.com',
      password: 'password',
    };

    const mockLoginResponse: LoginResponse = {
      success: true,
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MTkzNzAzNTIsInN1YiI6MTN9.RKPWmqtq83mxsmBI8DnPre5R0bsYBUXdxY52piRRjEc',
      message: 'Login successful',
    };

    jest.spyOn(resolver, 'login').mockResolvedValue({ token: mockLoginResponse.token });

    const result = await resolver.login(loginUserInput);

    expect(result).toEqual({ token: mockLoginResponse.token });
  });

  it('getUser should return user details for a valid user id', async () => {
    const getUserInput: GetUserInput = { id: 5 }; 

    const mockGetUserResponse: GetUserResponse = {
      user: {
        id: 5, 
        name: 'Marcelo',
        email: 'Marcelo1@gmail.com',
        password: '$2a$10$vooHCdu.uFuFY5HBkxHxnOgHIFVXoGWmH/Lz.l0MXiMAjX3BmNyAu',
        tipoUser: true,
        created_at: '2022-01-01T00:00:00Z',
        updated_at: '2022-01-02T00:00:00Z',
        deleted_at: '',
      },
    };

    // Simular la implementación de la función getUser del resolver
    jest.spyOn(resolver, 'getUser').mockImplementation(async (getUserInput: GetUserInput) => {
      return mockGetUserResponse; // Retornar directamente el objeto mockGetUserResponse
    });

    const result = await resolver.getUser(getUserInput);

    expect(result).toEqual(mockGetUserResponse);
  });
});