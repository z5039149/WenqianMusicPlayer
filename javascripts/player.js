
(function () {
//方法总结“
    // 面向对象：考虑功能的需求的变化；
    // 添加一个新的功能呢，构造一个新的类，这样就可以按照功能改变，高内聚低耦合

// 因为类实例化出来的实例如果保持在一个全局变量中的时候，虽然保证了每一处的使用，但是很可能会因为一些疏忽导致变量重写等问题
// 所以我们可以在每次想使用这个实例的时候都去new，保证每次new出来的都是同一个实例
// 只适合于只需要一个实例的场景，这种设计模式叫做单例模式

// 最终的单例模式实现后的类
class Player {
    constructor () {
        // 如果Player类已经有实例了，就返回实例，否则创建实例并返回
        return Player.instance || this.createInstance(arguments)
    }
    createInstance () { // 在没有实例的情况下创建实例的方法
        let instance = new PlayerInstance(arguments) // 创建实例
        Player.instance = instance // 将实例挂载到Player类上作为唯一实例
        return Player.instance
    }
}
console.log(lrcJSON[0] );
// 音乐数据类
class Music {
    constructor () {
        this.songList = [
            { id: 1, name: '丑八怪', singer: '薛之谦', src: './songs/丑八怪 - 薛之谦.mp3', imageUrl: './images/songs/choubaguai.jpg',songText:lrcJSON[0] },
            { id: 2, name: '演员', singer: '薛之谦', src: './songs/演员 - 薛之谦.mp3', imageUrl: './images/songs/yanyuan.jpg',songText:lrcJSON[1] },
            { id: 3, name: '绅士', singer: '薛之谦', src: './songs/绅士 - 薛之谦.mp3', imageUrl: './images/songs/shenshi.jpg',songText:lrcJSON[2] },
            { id: 4, name: '认真的雪', singer: '薛之谦', src: './songs/认真的雪 - 薛之谦.mp3', imageUrl: './images/songs/renzhendexue.jpg',songText:lrcJSON[3] },
        ]
    }

    getSongList () {// 保护类实例的私有数据
        return this.songList
    }

}

// 按钮类，可以更方便的获取按钮并绑定事件
class PlayerBtn {
    constructor (selector, options) {     
        this.$el = $(selector)
        this.el = this.$el[0]
        this.options = options
        this.bindEvents()
    }
    bindEvents () {
        console.log(this.el);
        for( var key in this.options ) {
            this.el.addEventListener(key, this.options[key])
        }
    }
}


// 进度条类
class Progress {
    constructor (selector, options) {
        this.$el = $(selector)
        Object.assign(this, options)//把options解构赋给this
        // $.extend(this, options)
        this.options = options
        this.el = this.$el[0]
        this.width = this.$el.width()//父容器的宽度
        this.init()
    }
    init () { // 初始化函数
        this.createElement()
        this.renderProgress()
        this.bindEvents()
    }
    createElement () { // 生成 value 和 点
        this.ovalue = $('<div class="value">')
        this.opointer = $('<div class="pointer">')
        this.$el.append(this.ovalue)
        this.$el.append(this.opointer)
    }
    renderProgress (valuePram) { // 渲染长度
        let { max, min, value } = this
        let result = valuePram || value
        let ratio = result / (max - min) // 比例
        this.ovalue.width(this.width * ratio)
        this.opointer.css('left', this.width * ratio - 3)
    }
    setProgress (value) { // 动态设置value
        this.renderProgress(value)
    }
    bindEvents () { // 绑定事件
        // 点击
        this.$el.on('click', (e) => {
            let { handler, max } = this
            // console.log(this);this在这里依然是progress类
            // 根据点击的位置计算出应有的value
            let value = e.offsetX / this.width * max // 当前的value
            if ( handler ) handler(value) // 执行回调函数将value反馈给播放器
            this.setProgress(value) // 调整进度条的长度
        })
    }
}

// 歌词类
class SongLrc{
    constructor(selector,lrcJSONValue){
        this.container=document.querySelector(selector);
        this.lrcJSONValue = lrcJSONValue;
        for(var key in lrcJSONValue){//遍历lrc	
            this.container.innerHTML += "<li><p>"+lrcJSONValue[key]+"</p></li>";//ul里填充歌词
        };
        this.text=document.querySelectorAll('.lrclist li p');
        this.text.forEach(function (t){
            t.style.color="#eee";
            t.style.lineHeight="1.6rem";
            t.style.textAlign="center";
        })
        this.el = document.querySelector('#audio') // audio dom
        this.$el = $(this.el) // audio jquery-dom
        this.init();
    }
    init(){
        this.autoPlay();
    }
    autoPlay(){
        this.el.addEventListener("timeupdate",this.playHandler.bind(this));
    }
    playHandler(){
        //获取当前的时间
        let currentTime = Math.round(this.el.currentTime);	
        if(currentTime<10){
            currentTime="[00:0"+currentTime+"]";
        }else if(currentTime<=60){
            currentTime="[00:"+currentTime+"]"
        }else if(currentTime%60<10){
            let second=(currentTime%60).toFixed(0);
            let minute=(currentTime/60).toFixed(0);
            currentTime="[0"+minute+":"+"0"+second+"]";     
        }else{
            let seconds=(currentTime%60).toFixed(0);
            let minutes=(currentTime/60).toFixed(0);
            currentTime="[0"+minutes+":"+seconds+"]";
        }
        let value=this.lrcJSONValue
        let text=this.text;
        text=Array.from(text);
        for(var key in value){//遍历lrc	      
            if(currentTime===key){
                text.forEach(function(t){
                    if(t.innerHTML===value[key]){
                        t.style.fontSize="16px";
                        t.style.fontWeight="bolder";
                        t.style.color="white";
                        let evt=new Event("text-change");
                        evt.index = text.indexOf(t)
                        document.dispatchEvent(evt);
                    }
                })
            }         
        }; 
        document.addEventListener("text-change",this.changeHandler.bind(this));    
            
    }  
    changeHandler(e){
      
        $(this.container).css({
            position: "absolute",
            top:-15*e.index+"px",
            left:"38px",
        })
        
       
    } 
}


// 创建播放器实例的真正的类
class PlayerInstance {
    constructor () {
        // 需要用到的dom 原生
        this.el = document.querySelector('#audio') // audio dom
        this.$el = $(this.el) // audio jquery-dom
        this.osongImage = $('.player-ui__img--song img')
        this.osongName = $('.player-ui__text--song')
        this.osingerName = $('.player-ui__text--singer')
        this.oBgEl = $('.player-ui__bg')
        this.oDisc = $('.player-ui__disc')
        this.oList = $('.player-list ul')
        this.onowTime = $('.player-ui__time--now')
        this.odurationTime = $('.player-ui__time--duration')
        this.ovolume = $('.player-ui__volume-wrapper .iconfont');
        this.songList = new Music().getSongList() // 歌曲信息
        this.loopMode = 0 // 循环模式 0 列表循环 1 随机播放 2 单曲循环
        // 页面中任何的显示不同都应该由数据来控制 MVC
        this.songIndex = 0  // 当前歌曲的索引
        this.el.volume = 0.4 // 音量
        this.num=0;
    }

    init () {// 初始化方法
        this.renderSongListHandler()
        this.renderSongHandler() // 渲染默认的歌曲
        this.bindEvents() // 绑定各种事件
    }
    renderSongListHandler () {// 渲染歌曲列表
        let result = ''
        this.songList.forEach(song => {
            result += `
                <li class="player-list__item">
                    <i class="iconfont icon-volume"></i>
                    ${ song.name }
                </li>
            `
        })
        this.oList.html(result)
    }

     // render的时候是通过改变this.songIndex来改变src,name,singer,imageUrl; 即数据驱动显示
    renderSongHandler () {// 渲染歌曲的处理
        let { src, name, singer, imageUrl } = this.songList[this.songIndex]
        this.el.src = src;
        this.osongImage.attr('src', imageUrl)
        this.osongName.html(name)
        this.osingerName.html(singer)
        this.oBgEl.css('background-image', `url(${ imageUrl })`)
        this.oList.find('li').removeClass('active').eq(this.songIndex).addClass('active')
        
        
        this.onowTime.html(new Gp9Util().formatTime(0))// 当前播放时间显示为0
    }

    playAndPauseHandler () {// 处理播放和暂停
                          //返回的是bool值
        let playState = this.el.paused // 播放状态
        let handler = playState ? this.el.play : this.el.pause // 执行的操作
        handler.call(this.el)
        this.renderPlayBtnWhenChange(playState)
    }
    mutedAndUnmutedHandler(){//处理静音与非静音
        this.volValue=$('.player-ui__volume .value')
        let initState = this.volValue.width()/100; //获取当前的音量
        let mutedState = this.el.muted; //静音状态
        this.el.muted = !this.el.muted;
        this.el.volume = mutedState ? initState : 0;
        this.renderMuted(mutedState);
    }
    renderMuted (mutedState){ //根据播放状态re-render volume icon
        if (!mutedState){
            this.ovolume.removeClass('icon-volume').addClass('icon-muted');
        }else{
            this.ovolume.removeClass('icon-muted').addClass('icon-volume');
        }
    }
    renderPlayBtnWhenChange (playState) { // 根据播放状态re-render disc
        // icon-play icon-pause
        if ( !playState ) {
                        // 变成jQuery元素
            this.playBtn.$el.removeClass('icon-pause').addClass('icon-play')
        } else {
            this.playBtn.$el.removeClass('icon-play').addClass('icon-pause')
        }
        this.oDisc.toggleClass('play')  
    }

    changeLoopHandler(){
        this.num++;
        if(this.num>2) this.num=0;
        this.loopMode=this.num;
        console.log(this.loopMode);
        this.renderLoop(this.num);
        // this.changeIndexDependLoop();
    }

    changeIndexDependLoop (style) { // 根据循环模式切换索引
        switch ( this.loopMode ) {
            case 0:  //按顺序播放
                let bigValue = this.songList.length - 1
                let smallValue = 0
                let limit = style ?  bigValue: smallValue
                let result = !style ?  bigValue: smallValue
                this.songIndex = this.songIndex === limit ? result : this.songIndex + (style ? 1 : -1); 
                break;           
            case 1: //单曲循环播放
                this.songIndex = this.songIndex;
                break;          
            case 2: //随机播放
                this.songIndex=Math.floor(Math.random()*4+1);
                console.log(this.songIndex);
                default:break;
        }
    }
    // 切换歌曲 
    // params style || index
    //  style 上一曲还是下一曲 true 下一曲 false 上一曲
    //  index 切换的指定的歌曲   
    changeSongHandler (param) { 
        // 0. 存储换歌前的播放状态 1. 更改歌曲的索引 2. 重新渲染歌曲 3. 根据换歌前是否播放控制当前是否播放
        let isPause = this.el.paused
        if ( typeof param === 'number' ) {
            this.songIndex = param
        } else {
            this.changeIndexDependLoop(param)
        }
        this.renderSongHandler()
        if ( !isPause ) this.el.play()
        
        this.lyrics = null;
        this.songContainer = document.querySelector('.lrclist');
        this.songContainer.innerHTML="",
        this.lyrics = new SongLrc('.lrclist',this.songList[this.songIndex].songText);
    
    }
    
    renderLoop(loopIndex){
        switch(loopIndex){
            case 0:
            console.log($('.player-ui__btn--loop'));
            $('.player-ui__btn--loop').removeClass('icon-random').addClass('icon-loop');
            break;
            case 1:
            $('.player-ui__btn--loop').removeClass('icon-loop').addClass('icon-single');
            break;
            case 2:
            $('.player-ui__btn--loop').removeClass('icon-single').addClass('icon-random');
            break;

        }
    }
    bindEvents () { // 绑定事件的方法
        // 播放按钮
        this.playBtn = new PlayerBtn('.player-ui__btn--play', {
            'click': this.playAndPauseHandler.bind(this)
        })
        // 上一曲
        this.prevBtn = new PlayerBtn('.player-ui__btn--prev', {
            'click': this.changeSongHandler.bind(this, false)
        })
        // 下一曲
        this.nextBtn = new PlayerBtn('.player-ui__btn--next', {
            'click': this.changeSongHandler.bind(this, true)
        })
        // 歌曲列表 点击换歌
        this.oList.delegate('li', 'click', (e) => {  //事件委托
            let index = $(e.target).index();
            this.changeSongHandler(index)
        })
        //循环键
        this.loop = new PlayerBtn('.player-ui__btn--loop',{
            'click':this.changeLoopHandler.bind(this)
        })
        // 音量
        this.volume = new Progress('.player-ui__volume', {
            min: 0,
            max: 1,
            value: this.el.volume,
            handler: value => {
                this.el.volume = value
            }
        })
        
        //音量图标
        this.volumeSetter = new PlayerBtn('.player-ui__volume-wrapper .iconfont',{
            'click':this.mutedAndUnmutedHandler.bind(this)
        })
        // 进度条
        this.$el.on('canplay', () => {
            // 更改总时长显示
            this.odurationTime.html(new Gp9Util().formatTime(this.el.duration))       
            if ( this.progress ){
                // 换歌之后，更改总时长
                this.progress.max = this.el.duration
                return false
            };
            this.lyrics = new SongLrc('.lrclist',this.songList[this.songIndex].songText);
            this.progress = new Progress('.player-ui__progress', {
                min: 0,
                max: this.el.duration,
                value: 0,
                handler: value => {
                    this.el.currentTime = value
                }
            })
        })
        // 在不断播放的过程中
        this.$el.on('timeupdate', () => {
            // 更改当前播放时间显示
            this.onowTime.html(new Gp9Util().formatTime(this.el.currentTime))
            this.progress.setProgress(this.el.currentTime)
            
        })
        // 播放完成后
        this.$el.on('ended', () => {
            this.changeSongHandler(this, true)
            this.el.play()
        })
    }
}





// 实例化出播放器的实例
new Player().init()



})();

// --------------------- 
// 作者：Zyaibrs 
// 来源：CSDN 
// 原文：https://blog.csdn.net/yzy_csdn/article/details/84536646 
// 版权声明：本文为博主原创文章，转载请附上博文链接！
