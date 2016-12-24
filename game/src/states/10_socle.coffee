
#-------------------------------------------------!
#            ####                  ####           !
#            ####=ooO=========Ooo= ####           !
#            ####  \\  (o o)  //   ####           !
#               --------(_)--------               !
#              --. ..- ...  .. ...   −− .         !
#-------------------------------------------------!
#                socle: 2016/12/07                !
#                      apch                       !
#-------------------------------------------------!
#  My name's rmb stands for Rambo the 'socler'    !
#-------------------------------------------------!

class Phacker.Game.Socle

    # Platform ss

    constructor: (@gm, @init) ->
        @_fle_          = 'Socle'
        @t_pressed       = 0 #as time pressed

        @set_platform()

    #.----------.----------
    # build socle
    #.----------.----------
    set_platform :->
        @draw_sky()
        @draw_btn()

    draw_sky :  ->
        @sky = @gm.add.sprite(0, @gm.init.sky.y0, 'sky')
        @gm.world.sendToBack(@sky)
        @sky.fixedToCamera = true;

    draw_btn: ->
        x =  @init.jmp_btn.x0
        y =  @init.jmp_btn.y0
        @pwr_btn = @gm.add.button(x, y, 'jmp_btn', @on_tap, @, 1, 1, 0)
        @pwr_btn.fixedToCamera = true

    bind:(@rmb, @stp) ->   # connect player & stages to the platform

    #.----------.----------
    #.manage player animations
    # with the button
    # tap low jump & double_tap for hight tap ; holding 300ms
    #.----------.----------
    on_tap: ->
        #first check low jump
        if @rmb.body.touching.down
            @t_pressed = new Date().getTime() # set time
            @rmb.body.velocity.y =  @init.jump.low
            @rmb.y -= 5
            @rmb.animations.play 'up'

        else # high jump ?
            dt = new Date().getTime() - @t_pressed
            if dt < @init.jmp_btn.hold # as dbl click holding
                @rmb.body.gravity.y = 0
                @rmb.body.velocity.y =  @init.jump.high
                @rmb.body.velocity.x  *=  .5
                @t_pressed = 0 # initialize button

    #.----------.----------
    # give remaining ms to end of the game timer
    #.----------.----------
    remaining_ms : ->  gameOptions.duration * 1000 - @gm.time._timers[0].events[0].timer.ms
