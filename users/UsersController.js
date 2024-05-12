const express = require("express");
const router = express.Router();
const User = require("./User");
const bcrypt = require("bcryptjs");

router.get("/admin/users", (req, res) => {
  User.findAll().then((users) => {
    res.render("admin/users/index", { users: users });
  });
});

router.get("/admin/users/create", (req, res) => {
  res.render("admin/users/create");
});

router.post("/users/create", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({
    where: {
      email: email,
    },
  }).then((user) => {
    if (user == undefined) {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);

      User.create({
        email: email,
        password: hash,
      })
        .then(() => {
          res.redirect("/");
        })
        .catch((err) => {
          res.redirect("/");
        });
    } else {
      res.redirect("/admin/users/create");
    }
  });
});

router.get("/login", (req, res) => {
  res.render("admin/users/login");
});

router.post("/authenticate", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ where: { email: email } }).then((user) => {
    if (user != undefined) {
      //Se existe um usuário com esse email
      // Validar aenha aqui
      const correct = bcrypt.compareSync(password, user.password);

      if (correct) {
        req.session.user = {
          id: user.id,
          email: user.email,
        };
        res.redirect("/admin/articles");
      } else {
        res.redirect("/login");
      }
    } else {
      res.redirect("/login");
    }
  });
});

router.get("/logout", (req, res) => {
  req.session.user = undefined;
  res.redirect("/");
});

router.post("/admin/users/delete", (req, res) => {
  const userId = req.body.userId; // Assumindo que você envia o ID do usuário a ser deletado no corpo da requisição

  User.findByPk(userId)
    .then((user) => {
      if (user) {
        user
          .destroy()
          .then(() => {
            res.redirect("/admin/users");
          })
          .catch((err) => {
            console.error("Erro ao deletar usuário:", err);
            res.redirect("/admin/users");
          });
      } else {
        console.error("Usuário não encontrado.");
        res.redirect("/admin/users");
      }
    })
    .catch((err) => {
      console.error("Erro ao encontrar usuário:", err);
      res.redirect("/admin/users");
    });
});

module.exports = router;
