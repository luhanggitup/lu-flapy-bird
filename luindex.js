//对象收编变量
// animate为运动函数
// initDate为初始数据值
// init为初始化函数
var bird = {
   // 初始化数据
   skyPosition: 0,
   skyStep: 2,
   birdTop: 220,
   startColor: 'blue',
   // 判断游戏是否是开始状态
   startFlage: false,
   birdStepY: 0,
   minTop:0,
   maxTop:570,
   // init为初始化函数
   init: function () {
      this.initDate();
      this.animate();
      this.handle();
   },
   // 初始化数据
   initDate: function () {
      this.el = document.getElementById('game');
      this.oBird = this.el.getElementsByClassName('bird')[0];
      this.oStart = this.el.getElementsByClassName('start')[0];
      this.oScore = this.el.getElementsByClassName('score')[0];
      this.oMask = this.el.getElementsByClassName('mask')[0];
      this.oEnd = this.el.getElementsByClassName('end')[0];
   },

   // 动画函数
   animate: function () {
      var count = 0;
      var self = this;
      this.timer = setInterval(() => {
         self.skyMove();
         if (this.startFlage) {
            self.birdDrop();
         }
         if (++count % 10 === 0) {
            if (!this.startFlage) {
               self.birdJump();
               self.startBound();
            }
            self.birdFly(count);
         }
      }, 30);
   },
   // 天空移动
   skyMove: function () {
      // this === bird
      this.skyPosition -= this.skyStep;
      this.el.style.backgroundPositionX = this.skyPosition + 'px';
   },
   // 小鸟蹦跶画面
   birdJump: function () {
      this.birdTop = this.birdTop === 220 ? 260 : 220;
      this.oBird.style.top = this.birdTop + 'px';
   },
   // 游戏开始时小鸟下落画面
   birdDrop: function () {
      this.birdTop += ++this.birdStepY;
      this.oBird.style.top = this.birdTop + 'px';
      this.judgeKnock();
   },
   // 小鸟飞
   birdFly: function (count) {
      this.oBird.style.backgroundPositionX = count % 3 * -30 + 'px';
   },
   // 文字开始放大
   startBound: function () {
      var prveColor = this.startColor;
      this.startColor = prveColor === 'blue' ? 'white' : 'blue';
      this.oStart.classList.remove('start-' + prveColor);
      this.oStart.classList.add('start-' + this.startColor);
   },
   // 小鸟临界点检测
   judgeKnock: function () {
      this.judgeBoundary();
      this.judgePipe();
   },
   // 下落检测
   judgeBoundary: function () { 
     if(this.birdTop > this.maxTop || this.birdTop < this.minTop){
        this.gameOver();
      }
   },
   // 柱子碰撞检测
   judgePipe: function () { },

   // 事件监听函数
   handle: function () {
      this.handStart();

   },
   // 点击开始文字后的监听
   handStart: function () {
      var self = this;
      this.oStart.onclick = function () {
         self.oBird.style.left = '80px';
         self.oStart.style.display = 'none';
         self.oScore.style.display = 'block';
         self.skyStep = 5;
         self.startFlage = true;
      }
   },
   // 游戏结束
   gameOver:function(){
    clearInterval(this.timer);
    this.oMask.style.display = 'block';
    this.oEnd.style.display = 'block';
    this.oScore.style.display = 'none';
    this.oBird.style.display = 'none';   
   }
}
bird.init();