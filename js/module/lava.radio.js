/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 * carl
 */

Lava.namespace('com.lava.radio', function() {
    this.Radio = Lava.create({
        initialize: function(module, action, args) {
            this.loadPage(module, action, args);
        },
        initializeUI:function(action,args) {
        	switch(action){
        		case 'radio': Lava.util.pager(1); break;
        	}
        },
        showProgramSlide:function(args,ev) {
            Lava.img.slideUploader({
                title:'编辑节目幻灯片',
                program_id:args.program_id,
                slideType:2
            });
        },
        showProgramEditor:function(args,ev) {
            var query = Lava.util.buildQuery(args);
            Lava.util.popup("/radio/program_edit?"+query,'program-editor');
        },
        delProgram:function(args) {
            Lava.ui.dialog({
                title:'删除节目',
                cancel:true,
                confirmText:'删除节目',
                content:'你确定要删除节目吗？如果删除节目，一旦删除就不能恢复。',
                confirm:function(){
                    $.post('/api/radio._delProgram.json?program_id='+args.program_id).done(function(res){
                        if (res.err === 'hapn.ok') {
                            Lava.ui.refreshNav(true);
                            location.href = '#module=browse&action=weatherRadio';
                        }
                        Lava.util.popmiss(1);
                    });
                }
            });
        },
        delSong:function(args) {
            if (!_u) { return Lava.util.callModFunc('account','showLogin'); }
             $.post('/api/radio._delProgramSong',{
               program_id:args.program_id,
               song_id:args.song_id
            }).done(function(res){
                if (res.err === 'radio.u_pub_song') {
                    Lava.ui.dialog({content:'节目不能少于10首歌曲，您不能删除音乐'});
                    return;
                }
                //删除成功，就把这一条删掉
                if (/action=program/.test(location.hash)) {
                    $('#song' + args.song_id).fadeOut();
                    $('#song' + args.song_id).remove();
                }
                var len = $('.song-list').length;
                for(var i = 1 ; i < len ; i++){
                    $($('.song-list')[i]).find('.showOrder').text(i);
                }
            });
        },
        addSong:function(args) {
            if (!_u) { return Lava.util.callModFunc('account','showLogin'); }
            $.post('/api/radio._addProgramSong',{
               program_id:args.program_id,
               song_id:args.song_id
            },function(res){
               if (res.err === 'radio.u_dupsong') {
                   Lava.ui.dialog({content:'此歌曲已经添加到节目，不需要重复添加。'});
               }
	       if (res.err === 'radio.u_nopri') {
                   Lava.ui.dialog({content:'该节目已审核，无权限编辑歌曲。'});
               }
               if (res.err === 'hapn.ok') {
                   Lava.ui.dialog({content:'添加到节目成功!',dissmissTimer:1});
               }
            });
        },
        appendSAlbum:function(args) {
            if (!_u) { return Lava.util.callModFunc('account','showLogin'); }
             $.post('/api/radio._appendSAlbum',args).done(function(res){
                if (res.err === 'hapn.ok' && args.op) {
                    //TODO 成功提示
                }
            });
        },
        recommend:function(args) {
            if (!_u) { return Lava.util.callModFunc('account','showLogin'); }
            $.post('/api/radio._recommend',args);
        },
        auditProgram:function(args) {
            Lava.util.popup('/radio/program_audit?program_id='+args.program_id+'&pass='+args.pass,'auditModal');
        },
        auditLog:function(args) {
            Lava.util.popup('/radio/program_audit_log?program_id='+args.program_id,'auditLogModal');
        },
        programEditError:function(args) {
            switch (args.err) {
                case  'radio.u_pub_channel':
                    if (args.error || !window.radio_checkChannels || !radio_checkChannels()) {
	                    Lava.ui.dialog({title: '发布节目出错',
	                        content: '1、确认节目不少于10首歌曲<br/><font color="red">2、至少选择1个频道，最多选择3个频道；必须选择流派。</font>'});
	                    $('#program-notpub')[0].checked = true;
                    }
                    break;
                case  'radio.u_pub_song':
                    Lava.ui.dialog({title: '发布节目出错',
                        content: '<font color="red">1、确认节目不少于10首歌曲</font><br/>2、至少选择1个频道，最多选择3个频道；必须选择流派。'});
                    $('#program-notpub')[0].checked = true;
                    break;
            }
        }
    }, LavaModule);
});
