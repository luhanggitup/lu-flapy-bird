//对象收编变量
// animate为运动函数
// initDate为初始数据值
// init为初始化函
var bird = {
   // 初始化数据
   skyPosition: 0,
   skyStep: 2,
   birdTop: 220,
   startColor: 'blue',
   startFlage: false,
   birdStepY: 0,
   minTop: 0,
   maxTop: 570,
   pipeLength: 7,
   pipeArr: [],
   pipeLastIndex: 6,
   score: 0,

   // init为初始化函数
   init: function () {
      this.initDate();
      this.animate();
      this.handle();
      if(sessionStorage.getItem('play')){
         this.start();
      }
   },
   // 初始化数据
   initDate: function () {
      this.el = document.getElementById('game');
      this.oBird = this.el.getElementsByClassName('bird')[0];
      this.oStart = this.el.getElementsByClassName('start')[0];
      this.oScore = this.el.getElementsByClassName('score')[0];
      this.oMask = this.el.getElementsByClassName('mask')[0];
      this.oReStart = this.el.getElementsByClassName('restart')[0];
      this.oEnd = this.el.getElementsByClassName('end')[0];
      this.oRankList = this.oEnd.getElementsByClassName('rank-list')[0];
      this.oFinalScore = this.oEnd.getElementsByClassName('final-score')[0];
      this.scoreArr = this.getScore();
      // console.log(this.scoreArr);
   },
   // 获取当前数据的值
   getScore: function () {
      var scoreArr = getLocal('score');
      return scoreArr ? scoreArr : [];
   },
   // 动画函数
   animate: function () {
      var count = 0;
      var self = this;
      this.timer = setInterval(() => {
         self.skyMove();
         if (this.startFlage) {
            self.birdDrop();
            self.pipeMove();
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
   // 柱子移动
   pipeMove: function () {
      for (var i = 0; i < this.pipeLength; i++) {
         var oUpPipe = this.pipeArr[i].up;
         var oDownPipe = this.pipeArr[i].down;
         var x = oUpPipe.offsetLeft - this.skyStep;
         if (x < -52) {
            var lastPipeLeft = this.pipeArr[this.pipeLastIndex].up.offsetLeft;
            oUpPipe.style.left = lastPipeLeft + 300 + 'px';
            oDownPipe.style.left = lastPipeLeft + 300 + 'px';
            this.pipeLastIndex = ++this.pipeLastIndex % this.pipeLength;
            this.getPipeHeight();
            continue;
         }
         oUpPipe.style.left = x + 'px';
         oDownPipe.style.left = x + 'px';
      }
   },
   // 获取柱子的高度
   getPipeHeight: function () {
      var upHeight = 50 + Math.floor(Math.random() * 175);
      var downHeight = 600 - 150 - upHeight;
      return {
         up: upHeight,
         down: downHeight,
      }
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
      this.addScore();
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
      if (this.birdTop > this.maxTop || this.birdTop < this.minTop) {
         this.gameOver();
      }
   },
   // 柱子碰撞检测
   judgePipe: function () {
      // 相遇的时候是95  离开的时候等于13
      var index = this.score % this.pipeLength;
      var pipeX = this.pipeArr[index].up.offsetLeft;
      var pipeY = this.pipeArr[index].y;
      var birdY = this.birdTop;
      if ((pipeX <= 95 && pipeX >= 13) && (birdY <= pipeY[0] || birdY >= pipeY[1])) {
         this.gameOver();
      }
   },
   //  加分
   addScore: function () {
      var index = this.score % this.pipeLength;
      var pipeX = this.pipeArr[index].up.offsetLeft;
      if (pipeX < 13) {
         this.oScore.innerText = ++this.score;
      }
   },

   // 事件监听函数
   handle: function () {
      this.handStart();
      this.handleClick();
      this.handleRestart();
   },
   // 点击开始文字后的监听
   handStart: function () {
      var self = this;
      this.oStart.onclick = this.start.bind(this);   
   },
   start:function(){
      var self =this;
      self.startFlage = true;
      self.oBird.style.left = '80px';
      self.oBird.style.transition = "none";
      self.oStart.style.display = 'none';
      self.oScore.style.display = 'block';
      self.skyStep = 5;
      self.startFlage = true;
      for (var i = 0; i < self.pipeLength; i++) {
         self.createPipe(300 * (i + 1));
      }
   },
   // 小鸟飞行函数
   handleClick: function () {
      var self = this;
      this.el.onclick = function (e) {
         if (!e.target.classList.contains('start')) {
            self.birdStepY = -10;
         }
      }
   },
   handleRestart:function(){
      this.oReStart.onclick = function (){
         sessionStorage.setItem('play',true);
         window.location.reload();
        
      }
   },
   // 创建柱子
   createPipe: function (x) {
      var upHeight = 50 + Math.floor(Math.random() * 175);
      var downHeight = 600 - 150 - upHeight;
      // var oDiv = document.createElement('div');
      // oDiv.classList.add('pipe');
      // oDiv.classList.add('pipe-up');
      // oDiv.style.height = upHeight + 'px';
      // this.el.appendChild(oDiv);
      var oUp = creatEle('div', ['pipe', 'pipe-up'], {
         height: upHeight + 'px',
         left: x + 'px',
      })
      var oDown = creatEle('div', ['pipe', 'pipe-bottom'], {
         height: downHeight + 'px',
         left: x + 'px',
      })
      this.el.appendChild(oUp);
      this.el.appendChild(oDown);
      this.pipeArr.push({
         up: oUp,
         down: oDown,
         y: [upHeight, upHeight + 150]
      })
   },
   // 存分数
   setScore: function () {
      this.scoreArr.push({
         score: this.score,
         time: this.getDate(),
      })
      // 分数排名
      this.scoreArr.sort(function(a,b){
         return b.score - a.score;
      })
      setLocal('score',this.scoreArr);
   },
   //获取时间
   getDate: function () {
      var d = new Date();
      var year = formatNum(d.getFullYear());
      var month = formatNum(d.getMonth() + 1);
      var day = formatNum(d.getDate());
      var hour = formatNum(d.getHours());
      var minute = formatNum(d.getMinutes());
      var second = formatNum(d.getSeconds());
      return `${year}.${month}.${day} ${hour}:${minute}:${second}`;
   },
   // 游戏结束
   gameOver: function () {
      clearInterval(this.timer);
      // 游戏结束时添加分数
      this.setScore();
      this.oMask.style.display = 'block';
      this.oEnd.style.display = 'block';
      this.oScore.style.display = 'none';
      this.oBird.style.display = 'none';
      this.oFinalScore.innerText = this.score;
      this.renderRankList();
   },
   renderRankList:function(){
      var template = '';
      for(var i = 0;i < 8;i++){
         template += `
         <li class="rank-item">
         <span class="rank-degree first">${i + 1}</span>
         <span class="rank-score">${this.scoreArr[i].score}</span>
         <span class="rank-tinme">${this.scoreArr[i].time}</span>
     </li> `
      }
         this.oRankList.innerHTML = template;
   },
}
bird.init();