
const request = require('supertest');
const createApp = require('./app');

let app;

beforeEach(() => {
  app = createApp();
});

describe('Pruebas CRUD de Productos', () => {

  test('GET /productos devuelve una lista vacia', async () => {
    const res = await request(app).get('/productos');

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });

  test('POST /productos crea un producto', async () => {
    const res = await request(app)
      .post('/productos')
      .send({ nombre: 'Laptop', precio: 4500 });

    expect(res.statusCode).toBe(201);
    expect(res.body.nombre).toBe('Laptop');
    expect(res.body.id).toBe(1);
  });

  test('GET /productos/:id busca un producto', async () => {
    await request(app)
      .post('/productos')
      .send({ nombre: 'Mouse', precio: 80 });

    const res = await request(app).get('/productos/1');

    expect(res.statusCode).toBe(200);
    expect(res.body.nombre).toBe('Mouse');
  });

  test('PUT /productos/:id actualiza un producto', async () => {
    await request(app)
      .post('/productos')
      .send({ nombre: 'Teclado', precio: 150 });

    const res = await request(app)
      .put('/productos/1')
      .send({ nombre: 'Teclado Gamer', precio: 250 });

    expect(res.statusCode).toBe(200);
    expect(res.body.nombre).toBe('Teclado Gamer');
    expect(res.body.precio).toBe(250);
  });

  test('DELETE /productos/:id elimina un producto', async () => {
    await request(app)
      .post('/productos')
      .send({ nombre: 'Monitor', precio: 1200 });

    const res = await request(app).delete('/productos/1');

    expect(res.statusCode).toBe(200);

    const lista = await request(app).get('/productos');
    expect(lista.body).toHaveLength(0);
  });

  test('GET de producto inexistente retorna 404', async () => {
    const res = await request(app).get('/productos/99');

    expect(res.statusCode).toBe(404);
  });

  test('POST rechaza datos invalidos', async () => {
    const res = await request(app)
      .post('/productos')
      .send({ nombre: '', precio: -10 });

    expect(res.statusCode).toBe(400);
  });

  test('PUT de producto inexistente retorna 404', async () => {
    const res = await request(app)
      .put('/productos/99')
      .send({ nombre: 'Laptop', precio: 100 });

    expect(res.statusCode).toBe(404);
  });

  test('PUT rechaza datos invalidos', async () => {
    await request(app)
      .post('/productos')
      .send({ nombre: 'Mouse', precio: 80 });

    const res = await request(app)
      .put('/productos/1')
      .send({ nombre: '', precio: -5 });

    expect(res.statusCode).toBe(400);
  });

  test('DELETE de producto inexistente retorna 404', async () => {
    const res = await request(app).delete('/productos/99');

    expect(res.statusCode).toBe(404);
  });

});
