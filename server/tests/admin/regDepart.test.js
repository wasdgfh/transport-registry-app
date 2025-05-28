const request = require('supertest');
const app = require('../../app');

describe('Registration Department API', () => {
  const department = {
    unitCode: '654321',
    departmentName: 'Тестовый отдел регистрации',
    address: 'ул. Проверочная, д. 10'
  };

  const updated = {
    departmentName: 'Обновлённый отдел',
    address: 'ул. Новая, д. 15'
  };

  afterAll(async () => {
    await request(app).delete(`/api/admin/reg-depart/${department.unitCode}`).catch(() => {});
    await request(app).delete('/api/admin/reg-depart/000000').catch(() => {}); // для not found
  });

  describe('Create & Read', () => {
    // Создание регистрационного отдела
    test('should create a department', async () => {
      const res = await request(app).post('/api/admin/reg-depart').send(department);
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('unitCode', department.unitCode);
    });

    // Получение списка отделов 
    test('should return list of departments', async () => {
      const res = await request(app).get('/api/admin/reg-depart');
      expect(res.statusCode).toBe(200);
      expect(res.body.data).toEqual(
        expect.arrayContaining([expect.objectContaining({ unitCode: department.unitCode })])
      );
    });

    // Поиск отдела по коду подразделения
    test('should find by unitCode', async () => {
      const res = await request(app)
        .get('/api/admin/reg-depart/search')
        .query({ unitCode: department.unitCode });
      expect(res.statusCode).toBe(200);
      expect(res.body.unitCode).toBe(department.unitCode);
    });
  });

  describe('Update', () => {
    // Полное обновление данных отдела (PUT)
    test('should update department', async () => {
      const res = await request(app)
        .put(`/api/admin/reg-depart/${department.unitCode}`)
        .send(updated);
      expect(res.statusCode).toBe(200);
      expect(res.body.departmentName).toBe(updated.departmentName);
    });

    // Частичное обновление данных отдела - только адрес (PATCH)
    test('should patch address', async () => {
      const res = await request(app)
        .patch(`/api/admin/reg-depart/${department.unitCode}`)
        .send({ address: 'ул. Финальная, д. 1' });
      expect(res.statusCode).toBe(200);
      expect(res.body.address).toBe('ул. Финальная, д. 1');
    });
  });

  describe('Delete', () => {
    // Удаление существующего отдела
    test('should delete department', async () => {
      const res = await request(app).delete(`/api/admin/reg-depart/${department.unitCode}`);
      expect(res.statusCode).toBe(204);
    });

    // Попытка удаления несуществующего отдела — должно вернуть 404
    test('should return 404 when deleting non-existent department', async () => {
      const res = await request(app).delete('/api/admin/reg-depart/000000');
      expect(res.statusCode).toBe(404);
    });

    // Отдел с сотрудниками не может быть удалён - должно вернуть 404
    test('should not delete department with employees', async () => {
      const dept = {
        unitCode: '999999',
        departmentName: 'Отдел с сотрудниками',
        address: 'ул. Примерная, д. 1'
      };

      const emp = {
        badgeNumber: '99-9999',
        unitCode: dept.unitCode,
        lastName: 'Тест',
        firstName: 'Тест',
        patronymic: 'Тестович',
        rank: 'Капитан'
      };

      await request(app).post('/api/admin/reg-depart').send(dept);
      await request(app).post('/api/admin/employees').send(emp);

      const res = await request(app).delete(`/api/admin/reg-depart/${dept.unitCode}`);
      expect(res.statusCode).toBe(400); 

      await request(app).delete(`/api/admin/employees/${emp.badgeNumber}`);
      await request(app).delete(`/api/admin/reg-depart/${dept.unitCode}`);
    });
  });

  describe('Pagination & Sorting', () => {
    beforeAll(async () => {
      for (let i = 0; i < 5; i++) {
        await request(app).post('/api/admin/reg-depart').send({
          unitCode: `00000${i}`,
          departmentName: `Отдел-${i}`,
          address: `Улица ${i}`
        });
      }
    });

    afterAll(async () => {
      for (let i = 0; i < 5; i++) {
        await request(app).delete(`/api/admin/reg-depart/00000${i}`).catch(() => {});
      }
    });

    // Пагинация — получение второй страницы по 2 записи
    test('should paginate departments', async () => {
      const res = await request(app).get('/api/admin/reg-depart').query({ limit: 2, page: 2 });
      expect(res.statusCode).toBe(200);
      expect(res.body.data.length).toBeLessThanOrEqual(2);
      expect(res.body.currentPage).toBe(2);
    });

    // Сортировка по названию отдела в порядке убывания
    test('should sort departments by departmentName desc', async () => {
      const res = await request(app)
        .get('/api/admin/reg-depart')
        .query({ sortOrder: 'desc' });

      const names = res.body.data.map(dep => dep.departmentName);
      const sorted = [...names].sort().reverse();
      expect(names).toEqual(sorted);
    });   
  });

  describe('Validation & Errors', () => {
    // Некорректный формат кода подразделения — должен вернуть 400
    test('should reject invalid unitCode', async () => {
      const res = await request(app).post('/api/admin/reg-depart').send({
        ...department,
        unitCode: '12'
      });
      expect(res.statusCode).toBe(400);
    });
    
    // Дублирование кода подразделения — должен вернуть 409
    test('should not allow duplicate department', async () => {
      await request(app).post('/api/admin/reg-depart').send(department);
      const res = await request(app).post('/api/admin/reg-depart').send(department);
      expect(res.statusCode).toBe(409);
    });    

    // Обновление несуществующего отдела — должен вернуть 404
    test('should return 404 for update non-existent', async () => {
      const res = await request(app)
        .put('/api/admin/reg-depart/000000')
        .send(updated);
      expect(res.statusCode).toBe(404);
    });
  });
  
});
