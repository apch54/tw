#    _____                 _
#   |  __ \               | |
#   | |__) |__ _ _ __ ___ | |__   ___     ,------------. ___
#   |  _  // _` | '_ ` _ \| '_ \ / _ \    | ···· ··    .'_#_`.
#   | | \ \ (_| | | | | | | |_) | (_) |   `------------|[o o]|
#   |_|  \_\__,_|_| |_| |_|_.__/ \___/    ----------ooO--(_)--Ooo-
#
#
# by fc on 2016-12-08
# rmb stands for rambo

class Phacker.Game.Player

    constructor: (gm, init)->
        @gm = gm
        @init = init
        @_fle_ = 'Rambo'

        @rmb = @gm.add.sprite(@init.rmb.x0, init.rmb.y0, 'rmb')
        @gm.physics.arcade.enable @rmb
        @rmb.anchor.x= .5
        #@rmb.body.setSize @init.rmb.width, @init.rmb.height
        @rmb.body.bounce.y = 0
        @rmb.body.gravity.y = @init.rmb.gravity  
        @rmb.body.drag.y = @init.rmb.dragy

        @rmb.animations.add 'up', [1], 3, true
        @rmb.animations.add 'right', [0, 1, 3, 1], 10, true
        @rmb.animations.play 'right'

        @rmb.body.velocity.x = @init.rmb.vx  

        @cam = {to: 0, i:0} #  val cam location for calulation : intermediate
        @has_low_scored = false



    #.----------.----------
    # binding or injections
    #.----------.----------
    set: -> @rmb #return player obj
    bind:(@stp) ->

    #.----------.----------
    # display bonus over rmb
    #.----------.----------
    add_bonus_txt: (txt)->
        sstyle = { font: "15px Courier", fill: "#ffff66" }
        @text1 = @gm.add.text 0, 0, '' + txt, sstyle

        @text1.y = -20
        @text1.x = -5

        @rmb.addChild @text1

    #.----------.----------
    # check rambo on stage, not too left, not too right
    #.----------.----------
    check_rmb_x: ->

        if  @rmb.x > @init.rmb.maxx   and    @rmb.body.velocity.x > 0
            @rmb.scale.x = -1
            @rmb.body.velocity.x = -@init.rmb.vx

        else if (@rmb.x - @init.rmb.width) < @init.rmb.minx  and  @rmb.body.velocity.x < 0
            @rmb.body.velocity.x = @init.rmb.vx
            @rmb.scale.x = 1

    #.----------.----------
    # detect rambo has jumped
    #.----------.----------
    has_jumped: ->
        # 1/ handle camera (cam)
        # rmb has jump so lower cam set in lower line
        if @cam.i >= @cam.to # cam 's to low
            @cam.i -= @init.cam_speed # go up
            @gm.camera.y = @cam.i

        else  @gm.camera.y = @cam.to # reset cam

        # hight jump : go through stage
        if @rmb.body.touching.up
            @gm.camera.y = @cam.to # reset cam
            @rmb.y += -15
            @rmb.body.velocity.y -= 150
            @rmb.body.velocity.x  /=  .5
            @rmb.body.gravity.y = @init.rmb.gravity

            @cam.i = @gm.camera.y  # initialisation to lift cam
            @cam.to = @gm.camera.y - @init.first_step.dy # cam step to do

            return 'hight'

        false # rmb has nor jmp hight
    #.----------.----------
    # check rmb animation
    #.----------.----------
    chk_low_jump: ->
        if @rmb.body.touching.down
            @has_low_scored =  off
            if @rmb.animations.name is 'up'  then @rmb.animations.play 'right'

        else # detect low jump

            # chk falling to score  short jump
            if @rmb.body.velocity.y > 0 and not @has_low_scored # to low x
                tx = @stp.tanks.getAt(0).x
                if (tx - 10 < @rmb.x < tx + 10 )
                    @has_low_scored = true
                    return 'low'

        return 'not low'
        

    #.----------.----------
    # reset player  when lost life
    #.----------.----------
    reset: ->
        #console.log "- #{@_fle_} : ", @rmb.x
        @rmb.x = @init.rmb.x0
        @rmb.y = @stp.stages.getAt(0).y - 55

        @rmb.body.velocity.y = 0
        @rmb.body.velocity.x = @init.rmb.vx
        @rmb.scale.x = 1

        @rmb.animations.play 'right'
        @init.rmb.has_crashed = false


