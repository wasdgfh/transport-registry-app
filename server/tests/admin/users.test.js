const request = require('supertest');
const app = require('../../app');
const { Owner, NaturalPerson, LegalEntity, RegistrationDepart, Employee } = require('../../models/associations');

describe('User API', () => {
  let createdAdmin, createdOwner1, createdOwner2, createdEmployee;

  const testData = {
    owner1: {
      address: 'г. Москва, ул. Пушкина, д. 44, кв. 77'
    },
    owner2: {
      address: 'г. Москва, ул. Депутатская, д. 1'
    },
    user1: {
      passportData: '1234 567890',
      address: 'г. Москва, ул. Пушкина, д. 44, кв. 77',
      lastName: 'Иван',
      firstName: 'Иванов',
      patronymic: 'Иванович'
    },
    user2: {
      taxNumber: '1234567890',
      address: 'г. Москва, ул. Депутатская, д. 1',
      companyName: 'Аренда ТС'
    },
    regDepart: {
      unitCode: '535654',
      departmentName: 'МРЭО-53 УГИБДД по г. Москве',
      address: 'г. Москва, Северный Округ, ст. 4'
    },
    user3: {
      badgeNumber: '68-6306',
      unitCode: '535654',
      lastName: 'Сергей',
      firstName: 'Сергеев',
      patronymic: 'Сергеевич',
      rank: 'Капитан'
    },
    adminData: {
      email: 'admin_test@example.com',
      password: 'AdminPass123',
      role: 'ADMIN'
    },
    ownerData1: {
      email: 'owner_test1@example.com',
      password: 'OwnerPass123',
      role: 'OWNER',
      passportData: '1234 567890'
    },
    ownerData2: {
      email: 'owner_test2@example.com',
      password: 'OwnerPass456',
      role: 'OWNER',
      taxNumber: '1234567890'
    },
    employeeData: {
      role: 'EMPLOYEE',
      badgeNumber: '68-6306'
    }
  };

  beforeAll(async () => {
    await Owner.bulkCreate([testData.owner1, testData.owner2]);
    await NaturalPerson.create(testData.user1);
    await LegalEntity.create(testData.user2);
    await RegistrationDepart.create(testData.regDepart);
    await Employee.create(testData.user3);
  });

  describe('Create & Read', () => {
    // Создание пользователя
    test('should create a user', async () => {
      const res = await request(app).post('/api/admin/users').send(userData);
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('id'); // Проверка, что пользователь создан и есть ID
      expect(res.body).not.toHaveProperty('password'); // Пароль не должен возвращаться в ответе
      createdUser = res.body; // Сохранение ID для последующих тестов
    });

     // Получение пользователей
    test('should get list of users', async () => {
      const res = await request(app).get('/api/admin/users');
      expect(res.statusCode).toBe(200);
      expect(res.body.data).toEqual(expect.arrayContaining([
        expect.objectContaining({ email: userData.email })
      ]));
    });

    // Поиск пользователя по email
    test('should find user by email', async () => {
      const res = await request(app).get('/api/admin/users/search').query({ email: userData.email });
      expect(res.statusCode).toBe(200);
      expect(res.body.email).toBe(userData.email);
    });
  });

  describe('Update', () => {
    // Частичное обновление данных пользователя (PATCH)
    test('should update user partially', async () => {
      const res = await request(app).patch(`/api/admin/users/${createdUser.id}`).send(updatedData);
      expect(res.statusCode).toBe(200);
      expect(res.body.email).toBe(updatedData.email);
    });
  });

  describe('Delete', () => {
    // Удаление существующего пользователя по ID
    test('should delete user', async () => {
      const res = await request(app).delete(`/api/admin/users/${createdUser.id}`);
      expect(res.statusCode).toBe(204);
    });

    // Попытка удаления несуществующего пользователя — должно вернуть 404
    test('should return 404 after deletion', async () => {
      const res = await request(app).get('/api/admin/users/search').query({ email: updatedData.email });
      expect(res.statusCode).toBe(404);
    });
  });

  describe('Validation & Errors', () => {
    // Дублирование пользователя с существующим email — должен вернуть 409
    test('should not allow duplicate email', async () => {
      const res = await request(app).post('/api/admin/users').send({ ...userData, email: updatedData.email });
      expect(res.statusCode).toBe(409);
    });

    // Обновление несуществующего пользователя по ID — должен вернуть 404
    test('should return 404 when updating non-existent user', async () => {
      const res = await request(app).patch('/api/admin/users/9999999').send({ role: 'ADMIN' });
      expect(res.statusCode).toBe(404);
    });

    // Попытка создать пользователя с коротким паролем — должен вернуть 400
    test('should reject short password', async () => {
      const res = await request(app).post('/api/admin/users').send({
        ...userData,
        email: 'shortpass@example.com',
        password: '123'
      });
      expect(res.statusCode).toBe(400);
    });
  });
});
