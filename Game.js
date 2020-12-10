class Game{
  constructor(_size){
    this.done = false;
    this.pl = true;
    this.plmove = -1;
    this.ai= false;
    this.npl = null;
    this.currpl = true;

    this.board = [];
    for(let i = 0; i < _size; i++){
      let row = [];
      for(let j = 0; j < _size; j++){
        row.push(this.npl);
      }
      this.board.push(row);
    }
  }

  update(){
    this.show();

    if(this.done){
      return null;
    }

    if(this.currpl == this.pl){
      if(this.plmove >= 0 && this.plmove < this.board.length){
        this.plturn(this.plmove);
        this.plmove = -1;
        this.currpl = this.ai;
      }
    }
    else{
      this.aiturn();
      this.currpl = this.pl;
    }
  }

  plturn(x){
    if(this.done){
      return null;
    }

    let move;
    for(let y = this.board.length-1; y >= 0; y--){
      if(y == 0 && this.board[y][x] != this.npl){
       return false;
      }
      if(this.board[y][x] == this.npl){
       this.board[y][x] = this.pl;
       if(this.won(x, y, this.pl)){
         this.done = true;
       }
       break;
      }
    }
  }

  getplmove(x, y){
    if(x < 0 || x > width || y < 0 || y > height){
      return null;
    }
    this.plmove = floor(map(x, 0, width, 0, this.board.length));
  }

  aiturn(){
    let move;
    let bestscore = Infinity;
    let alpha = -Infinity;
    let beta = Infinity;

    if(this.done){
     return;
    }

    let check = false;
    for(let x = 0; x < this.board.length; x++){
      for(let y = this.board.length-1; y >= 0; y--){
        if(this.board[y][x] == this.npl){
          this.board[y][x] = this.ai;
          let score = this.minimax(x, y, this.pl, alpha, beta);
          this.board[y][x] = this.npl;
          if(score == -1){
            this.board[y][x] = this.ai;
            if(this.won(x, y, this.ai)){
              this.done = true;
            }
            return;
          }
          if(score < bestscore){
            bestscore = score;
            move = {x, y};
          }
          break;
        }
      }
    }

    this.board[move.y][move.x] = this.ai;
    if(this.won(move.x, move.y, this.ai)){
      this.done = true;
    }
  }

  minimax(x, y, pl, alpha, beta){
    let done = [this.won(x, y, this.pl), this.won(x, y, this.ai)];
    if(done[0]){
      return 1;
    }
    else if(done[1]){
      return -1;
    }
    else if(done[0] == null && done[1] == null){
      return 0;
    }

    if(pl == this.pl){
      let bestscore = -Infinity;
      for(let x = 0; x < this.board.length; x++){
        for(let y = this.board.length-1; y >= 0; y--){
          if(this.board[y][x] == this.npl){
            this.board[y][x] = this.pl;
            let score = this.minimax(x, y, this.ai, alpha, beta);
            this.board[y][x] = this.npl;
            bestscore = max(bestscore, score);
            alpha = max(alpha, score);
            if(bestscore == 1){
              return bestscore;
            }
            if(beta <= alpha){
              return bestscore;
            }
            break;
          }
        }
      }
      return bestscore;
    }

    else{
      let bestscore = Infinity;
      for(let x = 0; x < this.board.length; x++){
        for(let y = this.board.length-1; y >= 0; y--){
          if(this.board[y][x] == this.npl){
            this.board[y][x] = this.ai;
            let score = this.minimax(x, y, this.pl);
            this.board[y][x] = this.npl;
            bestscore = min(bestscore, score);
            beta = min(beta, score);
            if(bestscore == -1){
              return bestscore;
            }
            if(beta <= alpha){
              return bestscore;
            }
            break;
          }
        }
      }
      return bestscore;
    }
  }

  won(x, y, pl){
    let i, j;
    let counter = 0;

    for(i = 0; i < this.board.length; i++){
      if(counter == 4){
        break;
      }
      if(this.board[y][i] == pl){
        counter++;
      }
      else{
        counter = 0;
      }
    }
    if(counter == 4){
        return true;
    }

    counter = 0;
    for(i = 0; i < this.board.length; i++){
      if(counter == 4){
        break;
      }
      if(this.board[i][x] == pl){
        counter++;
      }
      else{
        counter = 0;
      }
    }
    if(counter == 4){
        return true;
    }

    counter = 0;
    for(i = 0; i < this.board.length; i++){
      if(x+i+1 == this.board.length || y+i+1 == this.board.length){
        let x0 = x+i;
        let y0 = y+i;
        for(j = 0; j > -this.board.length; j--){
          if(counter == 4){
            break;
          }
          if(this.board[y0+j][x0+j] == pl){
            counter++;
          }
          else{
            counter = 0;
          }
          if(x0+j <= 0 || y0+j <= 0){
            break;
          }
        }
        break;
      }
    }
    if(counter == 4){
      return true;
    }

    counter = 0;
    for(i = 0; i < this.board.length; i++){
      if(x+i+1 == this.board.length || y-i == 0){
        let x0 = x+i;
        let y0 = y-i;
        for(j = 0; j > -this.board.length; j--){
          if(counter == 4){
            break;
          }
          if(this.board[y0-j][x0+j] == pl){
            counter++;
          }
          else{
            counter = 0;
          }
          if(x0+j <= 0 || y0-j+1 >= this.board.length){
            break;
          }
        }
        break;
      }
    }
    if(counter == 4){
      return true;
    }

    counter = 0;
    for(i = 0; i < this.board.length; i++){
      for(j = 0; j < this.board.length; j++){
        if(this.board[i][j] == this.npl){
          return false;
        }
        else{
          counter++;
        }
      }
    }
    if(counter == this.board.length * this.board.length){
      return null;
    }
  }

  show(){
    let a = height/this.board.length;
    let b =  (height/(1+this.board.length))/2;
    for(let y = 0; y < this.board.length; y++){
      for(let x = 0; x < this.board.length; x++){
        if(this.board[y][x] == this.npl){
          noFill();
          stroke(255);
          circle(b+x*a, b+y*a, 2*b);
        }
        else if(this.board[y][x] == this.pl){
          fill(255, 0, 0);
          circle(b+x*a, b+y*a, 2*b);
        }
        else{
          fill(0, 0, 255);
          circle(b+x*a, b+y*a, 2*b);
        }
      }
    }
  }
}
