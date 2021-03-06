/**
 * Created by Administrator on 2016/1/9.
 */
function down(e){
    this.x = this.offsetLeft;
    this.y = this.offsetTop;
    this.mx = e.pageX;
    this.my = e.pageY;
    if(this.setCapture){
        this.setCapture();
        on(this,"mousemove",move);
        on(this,"mouseup",up);
    }else{
        this.MOVE = processThis(this,move);
        this.UP = processThis(this,up);
        on(document,"mousemove",this.MOVE)
        on(document,"mouseup",this.UP)
    }
    e.preventDefault();
}
function move(e){
    this.style.left = this.x + (e.pageX - this.mx) + "px";
    this.style.top = this.y + (e.pageY - this.my) + "px";

    if(!this.prevPosi){
        this.prevPosi = e.pageX;
    }else{
        this.flySpeed = e.pageX - this.prevPosi;  //鼠标当次的位置 - 鼠标上次的位置 鼠标的速度
        this.prevPosi = e.pageX;
    }
}
function up(e){
    if(this.releaseCapture){
        this.releaseCapture();
        off(this,"mousemove",move);
        off(this,"mouseup",up);
    }else{
        off(document,"mousemove",this.MOVE);
        off(document,"mouseup",this.UP);
    }
    drop.call(this,e)
    fly.call(this,e)
    clearTimeout(this.droptimer);
    clearTimeout(this.flyTimer);
}


function drop(){ //自由落体
    if(!this.dropSpeed){
        this.dropSpeed = 7;
        this.flag = 0;
    }else{
        this.dropSpeed +=7;
    }
    var posi = this.offsetTop + this.dropSpeed;
    this.dropSpeed *= 0.97;
    var maxBottom = document.documentElement.clientHeight - this.offsetHeight;
    if(posi > maxBottom){
        this.style.top = maxBottom + "px";
        this.dropSpeed *= -1; //调头
        this.flag++;
    }else{
        this.style.top = posi + "px";
        this.flag = 0;
    }
    if(this.flag < 2){
        this.dropTimer = window.setTimeout(processThis(this,drop),20)
    }
}

function fly(){
    this.flySpeed *= .97;
    var posi = this.offsetLeft + this.flySpeed; //正常情况下合子应该到的位置
    var maxRight = document.documentElement.clientWidth - this.offsetWidth;

    if(posi <=0){
        this.style.left = 0;
        this.flySpeed *= -1;
    }else if(posi >= maxRight){
        this.style.left = maxRight + "px";
        this.flySpeed *= -1;
    }else{
        this.style.left = posi + "px";
    }
    if(Math.abs(this.flySpeed) >= 0.5){
        this.flyTimer = window.setTimeout(processThis(this,fly),20);
    }
}