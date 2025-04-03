const request = require('supertest');
const express = require('express');
const CustomerHttpHandler = require('../handlers/student');

jest.mock('../controllers/student');

describe('CustomerHttpHandler', () => {
  let app;
  let mockController;

  beforeEach(() => {
    app = express();
    app.use(express.json());

    mockController = {
      getAll: jest.fn(),
      getById: jest.fn(),
    };

    // Dependency injection

    // Instead of initializing a controller inside the student handler, we inject it.

    // This way, we can:
    //  - Use a production environment controller, which runs the business logic and database calls
    //  - Use a testing mock environment, which only returns the result of unit tests

    const httpHandler = new CustomerHttpHandler(mockController);

    // Update method names to match the handler class
    app.get('/students', httpHandler.getAllCustomers.bind(httpHandler));
    app.get('/students/:id', httpHandler.getCustomerById.bind(httpHandler));
  });

  describe('GET /students', () => {
    it('should return all students', async () => {
      const students = [
        { id: 1, name: 'John Doe', email: 'john@example.com' },
      ];
      mockController.getAll.mockResolvedValue(students);

      const response = await request(app)
        .get('/students')
        .expect(200);

      expect(response.body).toEqual(students);
      expect(mockController.getAll).toHaveBeenCalled();
    });
  });

  describe('GET /students/:id', () => {
    it('should return a student by ID', async () => {
      const student = { id: 1, name: 'John Doe', email: 'john@example.com' };
      mockController.getById.mockResolvedValue(student);

      const response = await request(app)
        .get('/students/1')
        .expect(200);

      expect(response.body).toEqual(student);
      expect(mockController.getById).toHaveBeenCalledWith('1');
    });
  });
});
