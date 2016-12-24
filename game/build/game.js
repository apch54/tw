(function() {
  Phacker.Game.Socle = (function() {
    function Socle(gm, init) {
      this.gm = gm;
      this.init = init;
      this._fle_ = 'Socle';
      this.t_pressed = 0;
      this.set_platform();
    }

    Socle.prototype.set_platform = function() {
      this.draw_sky();
      return this.draw_btn();
    };

    Socle.prototype.draw_sky = function() {
      this.sky = this.gm.add.sprite(0, this.gm.init.sky.y0, 'sky');
      this.gm.world.sendToBack(this.sky);
      return this.sky.fixedToCamera = true;
    };

    Socle.prototype.draw_btn = function() {
      var x, y;
      x = this.init.jmp_btn.x0;
      y = this.init.jmp_btn.y0;
      this.pwr_btn = this.gm.add.button(x, y, 'jmp_btn', this.on_tap, this, 1, 1, 0);
      return this.pwr_btn.fixedToCamera = true;
    };

    Socle.prototype.bind = function(rmb, stp) {
      this.rmb = rmb;
      this.stp = stp;
    };

    Socle.prototype.on_tap = function() {
      var dt;
      if (this.rmb.body.touching.down) {
        this.t_pressed = new Date().getTime();
        this.rmb.body.velocity.y = this.init.jump.low;
        this.rmb.y -= 5;
        return this.rmb.animations.play('up');
      } else {
        dt = new Date().getTime() - this.t_pressed;
        if (dt < this.init.jmp_btn.hold) {
          this.rmb.body.gravity.y = 0;
          this.rmb.body.velocity.y = this.init.jump.high;
          this.rmb.body.velocity.x *= .5;
          return this.t_pressed = 0;
        }
      }
    };

    Socle.prototype.remaining_ms = function() {
      return gameOptions.duration * 1000 - this.gm.time._timers[0].events[0].timer.ms;
    };

    return Socle;

  })();

}).call(this);

(function() {
  Phacker.Game.Player = (function() {
    function Player(gm, init) {
      this.gm = gm;
      this.init = init;
      this._fle_ = 'Rambo';
      this.rmb = this.gm.add.sprite(this.init.rmb.x0, init.rmb.y0, 'rmb');
      this.gm.physics.arcade.enable(this.rmb);
      this.rmb.anchor.x = .5;
      this.rmb.body.bounce.y = 0;
      this.rmb.body.gravity.y = this.init.rmb.gravity;
      this.rmb.body.drag.y = this.init.rmb.dragy;
      this.rmb.animations.add('up', [1], 3, true);
      this.rmb.animations.add('right', [0, 1, 3, 1], 10, true);
      this.rmb.animations.play('right');
      this.rmb.body.velocity.x = this.init.rmb.vx;
      this.cam = {
        to: 0,
        i: 0
      };
      this.has_low_scored = false;
    }

    Player.prototype.set = function() {
      return this.rmb;
    };

    Player.prototype.bind = function(stp) {
      this.stp = stp;
    };

    Player.prototype.add_bonus_txt = function(txt) {
      var sstyle;
      sstyle = {
        font: "15px Courier",
        fill: "#ffff66"
      };
      this.text1 = this.gm.add.text(0, 0, '' + txt, sstyle);
      this.text1.y = -20;
      this.text1.x = -5;
      return this.rmb.addChild(this.text1);
    };

    Player.prototype.check_rmb_x = function() {
      if (this.rmb.x > this.init.rmb.maxx && this.rmb.body.velocity.x > 0) {
        this.rmb.scale.x = -1;
        return this.rmb.body.velocity.x = -this.init.rmb.vx;
      } else if ((this.rmb.x - this.init.rmb.width) < this.init.rmb.minx && this.rmb.body.velocity.x < 0) {
        this.rmb.body.velocity.x = this.init.rmb.vx;
        return this.rmb.scale.x = 1;
      }
    };

    Player.prototype.has_jumped = function() {
      if (this.cam.i >= this.cam.to) {
        this.cam.i -= this.init.cam_speed;
        this.gm.camera.y = this.cam.i;
      } else {
        this.gm.camera.y = this.cam.to;
      }
      if (this.rmb.body.touching.up) {
        this.gm.camera.y = this.cam.to;
        this.rmb.y += -15;
        this.rmb.body.velocity.y -= 150;
        this.rmb.body.velocity.x /= .5;
        this.rmb.body.gravity.y = this.init.rmb.gravity;
        this.cam.i = this.gm.camera.y;
        this.cam.to = this.gm.camera.y - this.init.first_step.dy;
        return 'hight';
      }
      return false;
    };

    Player.prototype.chk_low_jump = function() {
      var ref, tx;
      if (this.rmb.body.touching.down) {
        this.has_low_scored = false;
        if (this.rmb.animations.name === 'up') {
          this.rmb.animations.play('right');
        }
      } else {
        if (this.rmb.body.velocity.y > 0 && !this.has_low_scored) {
          tx = this.stp.tanks.getAt(0).x;
          if ((tx - 10 < (ref = this.rmb.x) && ref < tx + 10)) {
            this.has_low_scored = true;
            return 'low';
          }
        }
      }
      return 'not low';
    };

    Player.prototype.reset = function() {
      this.rmb.x = this.init.rmb.x0;
      this.rmb.y = this.stp.stages.getAt(0).y - 55;
      this.rmb.body.velocity.y = 0;
      this.rmb.body.velocity.x = this.init.rmb.vx;
      this.rmb.scale.x = 1;
      this.rmb.animations.play('right');
      return this.init.rmb.has_crashed = false;
    };

    return Player;

  })();

}).call(this);

(function() {
  Phacker.Game.Step = (function() {
    function Step(gm, init) {
      this.gm = gm;
      this.init = init;
      this._fle_ = 'Step';
      this.stat = {
        nb: -1,
        step: {},
        tank: {}
      };
      this.platforms = ['platform1', 'platform2', 'platform3'];
      this.tank_faces = ['tank1', 'tank2', 'tank3'];
      this.stages = this.gm.add.group();
      this.stages.enableBody = true;
      this.tanks = this.gm.add.physicsGroup();
      this.tanks.enableBody = true;
      this.add_tank_step(3);
    }

    Step.prototype.add_tank_step = function(n) {
      var foo, i, ref, results;
      if (n == null) {
        n = 1;
      }
      results = [];
      for (foo = i = 1, ref = n; 1 <= ref ? i <= ref : i >= ref; foo = 1 <= ref ? ++i : --i) {
        this.add_step();
        results.push(this.add_tank());
      }
      return results;
    };

    Step.prototype.y0 = function(n) {
      return this.init.first_step.y0 - n * this.init.first_step.dy;
    };

    Step.prototype.add_step = function() {
      var platform, step;
      this.stat.nb++;
      platform = this.platforms[this.gm.rnd.integerInRange(0, 2)];
      step = this.stages.create(this.init.first_step.x0, this.y0(this.stat.nb), platform);
      this.stat.step = this.step;
      return step.body.immovable = true;
    };

    Step.prototype.replace_tank = function(num) {
      var tk;
      if (num == null) {
        num = 0;
      }
      tk = this.tanks.getAt(num);
      tk.x = this.init.tank.x0;
      if (tk.body.velocity.x < 0) {
        tk.body.velocity.x *= -1;
        return tk.scale.x *= -1;
      }
    };

    Step.prototype.tank_vx = function() {
      var n, vx;
      n = this.stat.nb % 4;
      switch (n) {
        case 0:
          vx = this.init.tank.vx;
          break;
        case 1:
          vx = this.init.tank.vx * 1.7;
          break;
        case 2:
          vx = this.init.tank.vx * .3;
          break;
        default:
          vx = this.init.tank.vx;
      }
      return vx;
    };

    Step.prototype.add_tank = function() {
      var rect, tank, tank_face, x0, y0;
      tank_face = this.tank_faces[this.gm.rnd.integerInRange(0, 2)];
      if (this.stat.nb === 0) {
        x0 = this.init.tank.x0;
      } else {
        x0 = this.gm.rnd.integerInRange(this.init.tank.minx + 30, this.init.tank.maxx - 30);
      }
      y0 = this.y0(this.stat.nb) - this.gm.init.tank.height;
      tank = this.tanks.create(x0, y0, tank_face, 0);
      rect = new Phaser.Rectangle(1, 0, 65, 42);
      tank.crop(rect);
      tank.anchor.x = .5;
      this.gm.physics.arcade.enable(tank);
      tank.body.gravity.y = 100;
      if (this.gm.rnd.integerInRange(0, 1) === 0) {
        tank.body.velocity.x = this.tank_vx();
      } else {
        tank.body.velocity.x = -this.tank_vx();
        tank.scale.x *= -1;
      }
      tank.animations.add('right', [0, 2, 1, 3], 10, true);
      tank.animations.add('left', [0, 3, 1, 2], 10, true);
      tank.animations.play('right');
      if (this.stat.nb % 4 === 3) {
        return tank.visible = false;
      }
    };

    Step.prototype.check_tank_x = function() {
      var i, len, ref, results, tk;
      ref = this.tanks.children;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        tk = ref[i];
        if (tk.x > this.init.tank.maxx && tk.body.velocity.x > 0) {
          tk.scale.x *= -1;
          tk.body.velocity.x *= -1;
          tk.animations.play('left');
          results.push(tk.body.velocity.y = -25);
        } else if ((tk.x - this.init.tank.width) < this.init.tank.minx && tk.body.velocity.x < 0) {
          tk.body.velocity.x *= -1;
          tk.scale.x *= -1;
          tk.animations.play('right');
          results.push(tk.body.velocity.y = -25);
        } else {
          results.push(void 0);
        }
      }
      return results;
    };

    Step.prototype.destroy_1st_stage = function() {
      this.tanks.getAt(0).destroy();
      return this.stages.getAt(0).destroy();
    };

    Step.prototype.tank_overlap = function(rmb) {
      var rmb_bounds, tk, tk_bounds;
      if ((this.tanks.getAt != null) && this.tanks.length > 0) {
        tk = this.tanks.getAt(0);
        rmb_bounds = rmb.getBounds();
        tk_bounds = tk.getBounds();
        if (Phaser.Rectangle.intersects(rmb_bounds, tk_bounds)) {
          if ((rmb.body.velocity.y < 5) && (rmb.body.velocity.y > -5)) {
            if (!this.init.rmb.has_crashed) {
              this.init.rmb.has_crashed = true;
              return true;
            }
          }
        }
        return false;
      }
    };

    return Step;

  })();

}).call(this);

(function() {
  Phacker.Game.Battle_field = (function() {
    function Battle_field(game, init) {
      var i, j;
      this.gm = game;
      this.init = init;
      this.stages = [];
      for (i = j = 0; j <= 2; i = ++j) {
        this.stages.push(new Phacker.Game.Step(this.gm, this.init, i));
      }
      console.log("- " + this._fle_ + " : ", this.stages);
      return;
    }

    return Battle_field;

  })();

}).call(this);

(function() {
  Phacker.Game.Effects = (function() {
    function Effects(gm, rmb, stp, init) {
      this._fle_ = 'Boom';
      this.gm = gm;
      this.rmb = rmb;
      this.stp = stp;
      this.init = init;
      this.top_stick = 0;
      this.tk = {};
      this.tk_vx = 0;
      this.rmb_vx = 0;
      this.effect_faces = ['effect1', 'effect2', 'effect3'];
      this.boom = this.gm.add.sprite(100, 100, this.effect_faces[this.gm.rnd.integerInRange(0, 1)]);
      this.boom.animations.add('explosion', [2, 1, 0], 10, true);
      this.boom.animations.add('implosion', [0, 1, 2], 10, true);
      this.boom.animations.play('explosion');
      this.boom.visible = false;
    }

    Effects.prototype.explode = function() {
      this.top_stick = new Date().getTime();
      this.tk = this.stp.tanks.getAt(0);
      this.tk_vx = this.tk.body.velocity;
      this.rmb_vx = this.rmb.body.velocity;
      this.tk.body.velocity = 0;
      this.rmb.body.velocity = 0;
      this.boom.visible = true;
      this.boom.x = (this.rmb.x + this.tk.x) / 2 - this.init.tank.width;
      return this.boom.y = this.rmb.y - 25;
    };

    Effects.prototype.restart = function() {
      var dt;
      dt = new Date().getTime() - this.top_stick;
      if ((2000 < dt && dt < 5000)) {
        this.tk.body.velocity = this.tk_vx;
        this.rmb.body.velocity = this.rmb_vx;
        this.top_stick = 0;
        return this.boom.visible = false;
      }
    };

    return Effects;

  })();

}).call(this);

(function() {
  Phacker.Game.A_sound = (function() {
    function A_sound(game, name) {
      this.gm = game;
      this.name = name;
      this.snd = this.gm.add.audio(this.name);
      this.snd.allowMultiple = true;
      this.add_markers();
      return;
    }

    A_sound.prototype.add_markers = function() {
      var i, len, results, snds, x;
      snds = ['dong', 'fsi', 'ding', 'wap_wap', 'twat'];
      results = [];
      for (i = 0, len = snds.length; i < len; i++) {
        x = snds[i];
        switch (x) {
          case 'dong':
            results.push(this.snd.addMarker(x, 0.05, 0.45));
            break;
          case 'fsi':
            results.push(this.snd.addMarker(x, 0.54, 1.22));
            break;
          case 'ding':
            results.push(this.snd.addMarker(x, 1.84, 1.06));
            break;
          case 'wap_wap':
            results.push(this.snd.addMarker(x, 3.03, 3.25));
            break;
          case 'twat':
            results.push(this.snd.addMarker(x, 6.44, 0.17));
            break;
          default:
            results.push(void 0);
        }
      }
      return results;
    };

    A_sound.prototype.play = function(key) {
      return this.snd.play(key);
    };

    return A_sound;

  })();

}).call(this);

(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  this.YourGame = (function(superClass) {
    extend(YourGame, superClass);

    function YourGame() {
      return YourGame.__super__.constructor.apply(this, arguments);
    }

    YourGame.prototype.update = function() {
      var low_hight_jmp;
      this._fle_ = ' Jeu Update : ';
      YourGame.__super__.update.call(this);
      this.game.physics.arcade.collide(this.rmb, this.stepsO.stages);
      this.game.physics.arcade.collide(this.stepsO.tanks, this.stepsO.stages);
      this.stepsO.check_tank_x();
      this.rmbO.check_rmb_x();
      low_hight_jmp = this.rmbO.has_jumped();
      if (low_hight_jmp === 'hight') {
        this.stepsO.destroy_1st_stage();
        this.stepsO.add_tank_step(1);
        this.win();
        this.cd.play('dong');
      }
      if (this.socleO.remaining_ms() < 15) {
        this.cd.play('wap_wap');
      }
      if (this.stepsO.tank_overlap(this.rmb)) {
        this.lostLife();
        this.lost();
        this.effO.explode();
        if (ge.heart.length < 1) {
          this.cd.play('wap_wap');
        } else {
          this.cd.play('twat');
        }
      }
      if (this.rmbO.chk_low_jump() === 'low') {
        this.winBonus();
        this.cd.play('ding');
      }
      return this.effO.restart();
    };

    YourGame.prototype.resetPlayer = function() {
      console.log("Reset the player ");
      this.stepsO.replace_tank(0);
      return this.rmbO.reset();
    };

    YourGame.prototype.create = function() {
      YourGame.__super__.create.call(this);
      this._fle_ = 'Jeu.create';
      this.game.physics.startSystem(Phaser.Physics.ARCADE);
      this.game.world.setBounds(0, -500000, 20000, 550000);
      this.socleO = new Phacker.Game.Socle(this.game, this.game.init);
      this.stepsO = new Phacker.Game.Step(this.game, this.game.init);
      this.rmbO = new Phacker.Game.Player(this.game, this.game.init);
      this.rmb = this.rmbO.set();
      this.rmbO.bind(this.stepsO);
      this.socleO.bind(this.rmb, this.stepsO);
      this.effO = new Phacker.Game.Effects(this.game, this.rmb, this.stepsO, this.game.init);
      this.cd = new Phacker.Game.A_sound(this.game, 'bs_audio');
      this.rmbO.reset();
      this.win();
      return this.cd.play('dong');
    };

    return YourGame;

  })(Phacker.GameState);

}).call(this);

(function() {
  var game;

  game = new Phacker.Game;

  game.setGameState(YourGame);

  game.setSpecificAssets(function() {
    var aud, dsk, ld, mob;
    this._fle_ = 'specific asset';
    dsk = root_design + "desktop/desktop_gameplay/";
    mob = root_design + "mobile/mobile_gameplay/";
    aud = "products/tank-warrior/game/audio/";
    ld = this.game.load;
    if (gameOptions.fullscreen) {
      ld.image('sky', mob + 'bg_gameplay.jpg');
    } else {
      ld.image('sky', dsk + 'bg_gameplay.jpg');
    }
    ld.image('platform1', dsk + 'platform/platform1.png');
    ld.image('platform2', dsk + 'platform/platform2.png');
    ld.image('platform3', dsk + 'platform/platform3.png');
    ld.spritesheet('jmp_btn', dsk + 'jump_btn.png', 200, 57, 2);
    ld.spritesheet('rmb', dsk + 'character_sprite/character_sprite.png', 35, 44, 4);
    ld.spritesheet('tank1', dsk + 'danger/danger1.png', 68, 42, 4);
    ld.spritesheet('tank2', dsk + 'danger/danger2.png', 68, 42, 4);
    ld.spritesheet('tank3', dsk + 'danger/danger3.png', 68, 42, 4);
    ld.spritesheet('effect1', dsk + 'effects/effect1.png', 86, 88, 3);
    ld.spritesheet('effect2', dsk + 'effects/effect2.png', 86, 88, 3);
    ld.spritesheet('effect3', dsk + 'effects/effect3.png', 86, 88, 3);
    ld.audio('bs_audio', [aud + 'bs.mp3', aud + 'bs.ogg']);
    this.game.init = {
      sky: {
        y0: 48
      },
      cam_speed: 2.2,
      jmp_btn: {
        x0: (this.game.width - 200) / 2,
        y0: this.game.height - 80,
        hold: 300
      },
      first_step: {
        x0: (this.game.width - 312) / 2,
        y0: this.game.height - 125,
        width: 312,
        dy: 120
      }
    };
    this.game.init.tank = {
      width: 68,
      height: 42,
      minx: this.game.init.first_step.x0 - 35,
      maxx: this.game.init.first_step.x0 + this.game.init.first_step.width - 30,
      vx: gameOptions.tank_vx,
      x0: this.game.init.first_step.x0 + this.game.init.first_step.width * .75
    };
    this.game.init.rmb = {
      vx: gameOptions.rambo_vx,
      x0: this.game.init.first_step.x0,
      y0: this.game.init.first_step.y0 - 45,
      height: 42,
      width: 35,
      gravity: 200,
      dragy: 2,
      minx: this.game.init.first_step.x0 - 30,
      maxx: this.game.init.first_step.x0 + this.game.init.first_step.width - 10,
      has_crashed: false
    };
    this.game.init.jump = {
      low: -135,
      high: -500
    };
    game.setTextColorGameOverState('white');
    game.setTextColorWinState('white');
    game.setTextColorStatus('orange');
    game.setOneTwoThreeColor('white');
    game.setLoaderColor(0xffffff);
    game.setTimerColor(0x60840A);
    return game.setTimerBgColor(0xffffff);
  });

  this.pauseGame = function() {
    return game.game.paused = true;
  };

  this.replayGame = function() {
    return game.game.paused = false;
  };

  game.run();

}).call(this);
