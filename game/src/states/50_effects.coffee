#written par fc on 2016-12-15

class Phacker.Game.Effects

    constructor:(gm, rmb, stp, init) ->
        @_fle_      ='Boom'
        @gm         = gm
        @rmb        = rmb # rambo
        @stp        = stp # satages : tanks & steps
        @init       = init

        @top_stick  = 0 # time  to stick environment
        @tk         = {}
        @tk_vx      = 0
        @rmb_vx     = 0

        @effect_faces= ['effect1','effect2','effect3']
        # only 2 effect used : 'effect2'
        @boom = @gm.add.sprite 100, 100, @effect_faces[@gm.rnd.integerInRange(0, 1)]
        @boom.animations.add  'explosion', [2, 1, 0], 10, true
        @boom.animations.add  'implosion', [0, 1 ,2], 10, true
        @boom.animations.play 'explosion'

        @boom.visible = false

    # animation when rambo's overlaping tank
    explode: ->
        #1/ top for begining of animation
        @top_stick = new Date().getTime()

        #2/ save parameters
        @tk  = @stp.tanks.getAt 0 #crashed tank at 0
        @tk_vx = @tk.body.velocity
        @rmb_vx = @rmb.body.velocity

        #3/ stop sprites and boom sprite visible
        @tk.body.velocity = 0
        @rmb.body.velocity = 0
        @boom.visible = on
        @boom.x = (@rmb.x  + @tk.x) / 2 - @init.tank.width
        @boom.y  = @rmb.y - 25

    # restart after an animation
    restart: ->
        dt = new Date().getTime()- @top_stick
        #wait 2 sec before restarting not more
        if 2000 < dt < 5000
            @tk.body.velocity = @tk_vx
            @rmb.body.velocity = @rmb_vx

            @top_stick = 0 # reset
            @boom.visible = false





