const express   = require('express');
const auth      = require('./controllers/authentication/authController');

//models-controllers
  const user      = require('./controllers/modelControllers/userController');
  const UserModel = require('./models/User');
  const TaskModel = require('./models/Task');
  const HubModel = require('./models/Hub');
  const RoomModel = require('./models/Room');
  const EquipmentModel = require('./models/Equipment');


const query = require('./controllers/other/query.js');

module.exports = function(app) {
  const routes = express.Router();
  // TODO centralize embedded strings
  /*-------SALEP ROUTES------------*/
  // User
    let getSelect = {};
    let listSelect = {};

  //user
    routes.post('user/create',   user.create);
    routes.post('user/edit',     auth.auth, user.edit);
    routes.post('user/remove',   query.remove(UserModel, 'User'));
    routes.get('user/:id',       query.get(UserModel, {hash: 0}, 'User'));
    routes.get('user/',          query.list(UserModel, {hash: 0}, 'User'));


//task
  routes.post('task/create',   query.create);
  routes.post('task/edit',     auth.auth, query.edit);
  routes.post('task/remove',   query.remove(TaskModel, 'Task'));
  routes.get('task/:id',       query.get(TaskModel, getSelect, 'Task'));
  routes.get('task/',          query.list(TaskModel, listSelect, 'Task'));

//hub
  routes.post('hub/create',   query.create);
  routes.post('hub/edit',     auth.auth, query.edit);
  routes.post('hub/remove',   query.remove(HubModel, 'Hub'));
  routes.get('hub/:id',       query.get(HubModel, getSelect, 'Hub'));
  routes.get('hub/',          query.list(HubModel, listSelect, 'Hub'));
//room
  routes.post('room/create',   query.create);
  routes.post('room/edit',     auth.auth, query.edit);
  routes.post('room/remove',   query.remove(RoomModel, 'Room'));
  routes.get('room/:id',       query.get(RoomModel, getSelect, 'Room'));
  routes.get('room/',          query.list(RoomModel, listSelect, 'Room'));

//equipment
  routes.post('equipment/create',   query.create);
  routes.post('equipment/edit',     auth.auth, query.edit);
  routes.post('equipment/remove',   query.remove(EquipmentModel, 'Equipment'));
  routes.get('equipment/:id',       query.get(EquipmentModel, getSelect, 'Equipment'));
  routes.get('equipment/',          query.list(EquipmentModel, listSelect, 'Equipment'));


// Other
  routes.post('/login', auth.login);

//use
  app.use('/api', routes);
}