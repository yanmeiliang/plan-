/*****************************游戏功能************************************
（1）、点击右边的游戏控制栏，点击改变游戏规则，改变背景和飞机，以及游戏的快慢
（2）、鼠标移动到自己的飞机，移动飞机根据鼠标，并且连续创建子弹，并且子弹移动，
（3）、子弹移动背景外删除子弹
（4）、自家飞机撞到背景栏游戏结束
runing :控制游戏进行;
speed:用来控制界面子弹的创建和移动的数据
 **************************************************************************/
//背景图片设置
//-------------------全局变量-------------------
var imgArr=[{
    img:"images/img_bg_level_2.jpg",
    position:"-224px  -255px"},
    {
        img:"images/img_bg_level_3.jpg",
        position:"-127px  -106px"},
    {
        img:"images/img_bg_level_4.jpg",
        position:'-6px 10px'
     },
    {
        img:"images/img_bg_level_5.jpg",
        position:"-272px 1px"}];

var runing=true;
var btnImg=document.getElementById('bg_img');
var img=document.getElementById('bg');
var myPlan=document.getElementById('my_plan');
var zidanMoveId;
var num=1;
var speed=[{creatZidanSpeed:1000,moveZidanSpeed:500},
    {creatZidanSpeed:700,moveZidanSpeed:400},
    {creatZidanSpeed:200,moveZidanSpeed:150},
    {creatZidanSpeed:100,moveZidanSpeed:70}];
var zidanFlag=0;
//存储子弹
var zidan=[];
var score=0;
//--------------(1)、功能：实现点击切换背景和自己的游戏--------
for(let i=1;i<btnImg.children.length;i++)

{
         if(i===btnImg.children.length-1){
             btnImg.children[i].onclick=function () {
                runing=false;
             }
         }
        else {
             btnImg.children[i].onclick=function () {
                 img.style.backgroundImage=`url(${imgArr[i-1].img})`;
                 myPlan.style.backgroundPosition=`${imgArr[i-1].position}`;
                runing=true;
                 zidanFlag=i-1;
                 console.log(zidanFlag);
         }
    }

}
//-----------------（2）、功能：鼠标移动，自己的飞机移动----点击的时候再移动
myPlan.onmousedown=function (event) {
    event=event||window.event;
    var x=event.clientX-myPlan.offsetLeft;
    var y=event.clientY-myPlan.offsetTop;
    CreatZidan();
    zidanMoveId=setInterval(function () {
        moveBulet();
    },speed[zidanFlag].moveZidanSpeed);
    document.onmousemove=function (e) {
      if(myPlan.offsetLeft<-10 ||myPlan.offsetLeft>395 ||myPlan.offsetTop<0 ||myPlan.offsetTop>620)
      {
          runing=false;
          if(confirm("游戏结束"))
          {
              clearInterval(zidanMoveId);
              document.onmousemove=null;
          }
      }

        if(runing)
        {
            myPlan.style.left=e.pageX-x+'px';
            myPlan.style.top=e.pageY-y+'px';
        }
   }
}
//----------------------（3）、功能：鼠标弹起的时候停止移动-------------------
myPlan.onmouseup=function () {
  document.onmousemove=null;
}
//--------------------（4）、功能：功能创建子弹---------------------
    function  CreatZidan() {
            setInterval(function () {
                if (runing) {
                        var div_zidan = document.createElement('div');
                        div_zidan.className = 'zidan';
                        div_zidan.style.top = parseInt(myPlan.offsetTop) -70 + 'px';
                        div_zidan.style.left = parseInt(myPlan.offsetLeft) +45 + 'px';
                        zidan.push(div_zidan);
                        img.appendChild(div_zidan);
                        console.log()
                }
            }, speed[zidanFlag].creatZidanSpeed);
    }


    //让子弹运动起来
    function moveBulet() {
        if(runing){
            for(let i=0;i<zidan.length;i++){
               zidan[i].style.top= zidan[i].offsetTop-30+'px';
               if(zidan[i].offsetTop<0)
               {
                  zidan[i].parentNode.removeChild(zidan[i]);
               }
            }
        }
    }

/*************敌方分析***********************************
 *（1）、首先循环创建敌方飞机
 * （2）、飞机有几种
 */
var enemy=[{
    img:'images/img_plane_boss_0.png',width:100,height:100}, {
    img:'images/img_plane_boss_1.png',width:100,height: 100},{
    img:'images/img_plane_boss_2.png',width:100,height:100
}];
var enemyData=[];
function creatEnemy() {
    if(runing){
        setInterval(function () {
            var x=parseInt(Math.random()*3);
            var enemyLeft=parseInt(Math.random()*400);
            console.log(enemyLeft+'left');
            console.log(x);
            var enemyDiv=document.createElement('div');
            enemyDiv.style.position='absolute';
            enemyDiv.style.width=enemy[x].width+'px';
            enemyDiv.style.height=enemy[x].height+'px';
            enemyDiv.style.backgroundImage=`url(${enemy[x].img})`;
            enemyDiv.style.top='-20px';
            enemyDiv.style.left=enemyLeft+'px';
            enemyDiv.style.backgroundSize=`100px 100px`;
            enemyDiv.style.backgroundPosition="center center";
            enemyDiv.style.backgroundRepeat='no-repeat'
            img.appendChild(enemyDiv);
            enemyData.push(enemyDiv);
            console.log(enemyData);
        },3000);
    }

}
    function enemyMove() {
         if(runing){
            for(let j=0;j<enemyData.length;j++){
                enemyData[j].style.top=enemyData[j].offsetTop+30+'px';
                if(enemyData[j].offsetTop>800){
                    //从数组里面删除被打掉的飞机
                    enemyData.splice(j-1,1);
                    enemyData[j].parentNode.removeChild(enemyData[j]);
                }
            }
         }

}
    setInterval(function enemyVSmyPlan() {
        for(let i=0;i<zidan.length;i++){
            for(let j=0;j<enemyData.length;j++){
                if(Math.abs(zidan[i].offsetTop-enemyData[j].offsetTop)<100  && Math.abs(zidan[i].offsetLeft-enemyData[j].offsetLeft)<100){
                    enemyData[j].parentNode.removeChild(enemyData[j]);
                    //从数组里面删除被打掉的飞机
                    enemyData.splice(j-1,1);
                    score+=1;
                    btnImg.children[0].children[0].innerText=`分数:${score}`;
                }

            }
        }
    },1000);
creatEnemy();
setInterval(function () {
    enemyMove();
},500);
