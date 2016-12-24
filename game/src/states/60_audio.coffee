# written by fc
# on2016
# description: 2016-10-05

#
#      '  _ ,  '     .- .-.. .-..  .- .-. .  ..-. --- --- .-..
#     -  (o)o)  -
#    -ooO'(_)--Ooo-


class  Phacker.Game.A_sound    #extends Phacker.Game.sound

    constructor : (game, name) ->
        @gm   = game
        @name = name

        @snd  = @gm.add.audio @name
        @snd.allowMultiple = true
        @add_markers()
        return


    add_markers: ()->
        snds = ['dong','fsi','ding','wap_wap', 'twat'] # list the whole sound in bs file

        for x in snds
            #console.log "In sound add cls", x
            switch x
                when 'dong'     then @snd.addMarker x,     0.05,  0.45   #  walk on steps
                when 'fsi'      then @snd.addMarker x,      0.54,  1.22   #   fall down
                when 'ding'     then @snd.addMarker x,     1.84,  1.06   # bonus o2
                when 'wap_wap'  then @snd.addMarker x,     3.03,  3.25   # the end
                when 'twat'     then @snd.addMarker x,     6.44,  0.17   # the end

    play: (key) -> @snd.play  key

