#fc-08-12-2016

class Phacker.Game.Step

    constructor: (@gm, @init) ->
        @_fle_     = 'Step'

        # save info elements
        @stat       = {nb: -1, step:{}, tank:{}}

        @platforms = ['platform1','platform2','platform3']
        @tank_faces= ['tank1','tank2','tank3']

        #define tanks & steps (stage)  element as  group
        @stages = @gm.add.group()
        @stages.enableBody = true

        @tanks  = @gm.add.physicsGroup()
        @tanks.enableBody = true

        @add_tank_step(3)

    #.----------.----------
    # add a tank & a step
    #.----------.----------
    add_tank_step:(n) ->
        if not n? then n = 1
        for foo in [1..n]
            @add_step()
            @add_tank()

    #.----------.----------
    # altitude of stage; - for up  ; n : nb of stage
    #.----------.----------
    y0 : (n) ->@init.first_step.y0 - n * @init.first_step.dy

    #.----------.----------
    # add one ground stage = group
    #.----------.----------
    add_step: ()->

        @stat.nb++
        # define platform shape
        platform  = @platforms[@gm.rnd.integerInRange(0, 2)]
        step = @stages.create(@init.first_step.x0 ,@y0(@stat.nb), platform)

        @stat.step = @step
        step.body.immovable  = on

    #.----------.----------
    # set tank location after the middle
    #.----------.----------
    replace_tank:(num)  -> # num is number of tank : 0 on bottom
        if not num? then num = 0
        tk  = @tanks.getAt num
        tk.x =  @init.tank.x0
        if tk.body.velocity.x < 0
            tk.body.velocity.x *= -1
            tk.scale.x *= -1 # left to right


    #.----------.----------
    # set tank vx = v + rnd(-v/2, v/2)
    #.----------.----------
    tank_vx: ->

        n = @stat.nb % 4
        switch  n
            when 0  then vx= @init.tank.vx
            when 1  then vx= @init.tank.vx * 1.7
            when 2  then vx= @init.tank.vx * .3
            else  vx =  @init.tank.vx

        return vx

    #.----------.----------
    # add one  tank on stage
    #.----------.----------
    add_tank : ->

        # choose tank color or face
        tank_face = @tank_faces[@gm.rnd.integerInRange(0, 2)]

        # first tank
        if @stat.nb is 0 then x0 = @init.tank.x0
        # init tank location
        else x0 = @gm.rnd.integerInRange  @init.tank.minx + 30, @init.tank.maxx - 30

        y0 = @y0(@stat.nb) - @gm.init.tank.height
        tank = @tanks.create(x0, y0, tank_face, 0);
        rect = new Phaser.Rectangle(1,0, 65,42)
        tank.crop(rect)
        tank.anchor.x = .5

        #tank.body.setSize  @init.tank.width, @init.tank.height  # remove gun tank of the sprite
        @gm.physics.arcade.enable tank
        tank.body.gravity.y = 100

        # init tank velocity  left or right
        if @gm.rnd.integerInRange(0, 1) is 0
             tank.body.velocity.x = @tank_vx()
        else
            tank.body.velocity.x = -@tank_vx()
            tank.scale.x *= -1 # left to right

        #tank cinematic
        tank.animations.add 'right', [0,2,1,3],  10, true
        tank.animations.add 'left',  [0,3,1,2],  10, true
        tank.animations.play  'right'

        if @stat.nb % 4 is 3 then tank.visible = false
    #.----------.----------
    # check tank 's over stage ; else make a uturn, vx=-vx and manage location
    #.----------.----------
    check_tank_x: ->
        for tk in @tanks.children

            # toward right so go left at the step border
            if  tk.x > @init.tank.maxx   and   tk.body.velocity.x > 0
                tk.scale.x *= -1
                tk.body.velocity.x *= -1
                tk.animations.play  'left'
                tk.body.velocity.y = -25

            # reaching left stage border
            else if (tk.x - @init.tank.width) < @init.tank.minx  and  tk.body.velocity.x < 0
                tk.body.velocity.x *= -1
                tk.scale.x *= -1
                tk.animations.play  'right'
                tk.body.velocity.y = -25

    #.----------.----------
    # destroy tank and stage under rambo
    # so it remain always 3 stages
    #.----------.----------
    destroy_1st_stage: ->
        @tanks.getAt(0).destroy()
        @stages.getAt(0).destroy()

    #.----------.----------
    # determine if rambo is overlaping tank
    # if overlaping he losts
    #.----------.----------
    tank_overlap:(rmb) ->
        if @tanks.getAt? and @tanks.length > 0
            tk  = @tanks.getAt 0
            rmb_bounds = rmb.getBounds() # ~ body rectangle
            tk_bounds  = tk.getBounds()

            #return true if  rmb overlaps the tank on soil
            if Phaser.Rectangle.intersects(rmb_bounds, tk_bounds)
                 if (rmb.body.velocity.y < 5) and (rmb.body.velocity.y > -5)
                    if not @init.rmb.has_crashed # rmb on soil
                        # avoid other lives to be losted
                        @init.rmb.has_crashed = true
                        return true #lost a live

            # no overlaping
            return false

