function start() { // Inicio da função start()
//Com essa função, estaremos escondendo a mensagem de início e criando essas novas divs.
	$("#inicio").hide(); //Essa forma de escrever só é possível por conta do JQuery. Essa função vai executar as outras mas mesmo assim, a  div vai sumir. Quando clicarmos na função onclick, o início vai sumir e eos outros elementos vão aparecer.
	
	$("#fundoGame").append("<div id='jogador' class='anima1'></div>"); //Essa divs estão sendo criadas exclusivamente aqui. e irão participar do id fundoGame. Não precisaremos criar ela no html. Perceba que todas elas já estão no css com o posicionamento certinho. Isso é uma das coisas que o jquery possibilita.
	$("#fundoGame").append("<div id='inimigo1' class='anima2'></div>");
	$("#fundoGame").append("<div id='inimigo2'></div>");
	$("#fundoGame").append("<div id='amigo' class='anima3'></div>");
    $("#fundoGame").append("<div id='placar'></div>"); //Última div adicionada 
    $("#fundoGame").append("<div id='energia'></div>");

    //Principais variáveis do jogo

    var jogo = {}

    var velocidade=5;

    var posicaoY = parseInt(Math.random() * 334); /*Verificar uma posição y randômica entre 0 e 334*/ 

    var podeAtirar=true;

    var fimdejogo = false;

    var pontos=0;

    var salvos=0;

    var perdidos=0;

    var energiaAtual=3; //Valor inicial da energia

    var TECLA = {
        W: 87, /*Mapeamento de teclas - Cada tecla tem o seu código*/ 
        S: 83,
        D: 68
        }

    jogo.pressionou = []; //Ponteiro para localizar os botões.

    //Perceba que no grupo das variáveis de som, não estamos utilizando JQuery. Estamos utilizando getelement etc. Fazemos isso por causa da incompatibilidade do som no JQuery em alguns Browsers.
    var somDisparo=document.getElementById("somDisparo");
    var somExplosao=document.getElementById("somExplosao");
    var musica=document.getElementById("musica");
    var somGameover=document.getElementById("somGameover");
    var somPerdido=document.getElementById("somPerdido");
    var somResgate=document.getElementById("somResgate");

    //Música em loop
    musica.addEventListener("ended", function(){ musica.currentTime = 0; musica.play(); }, false); //Adicionando um evento na var musica que quando identifica o fim - ended - Ela continua a tocar.
    musica.play();
    

     //Verifica se o usuário pressionou alguma tecla	
	
	$(document).keydown(function(e){
        jogo.pressionou[e.which] = true;
        });
    
    
        $(document).keyup(function(e){
           jogo.pressionou[e.which] = false;
        });
	
	//Game Loop

	jogo.timer = setInterval(loop,30); /*Setar o loop do jogo*/ 
	
	function loop() {
	
	movefundo();
    movejogador();
    moveinimigo1();
    moveinimigo2();
    moveamigo();
    colisao();
    placar();
    energia();
	
	} // Fim da função loop()

    //Função que movimenta o fundo do jogo
	
	function movefundo() {
	
        esquerda = parseInt($("#fundoGame").css("background-position")); /*Informando que esquerda terá umv alor inicial de 0*/
        $("#fundoGame").css("background-position",esquerda-1); /*Atualizando o valor da esquerda*/  /*A cada milisegundos, ele subtrai 1 pixel*/
        
        } // fim da função movefundo()

        function movejogador() {
	
            if (jogo.pressionou[TECLA.W]) {
                var topo = parseInt($("#jogador").css("top")); /*Pegando o valor css da propriedade top*/ 
                $("#jogador").css("top",topo-10); /*Atualizando - Movendo para cima*/ 
                
                if (topo<=0) {
                        
                    $("#jogador").css("top",topo+10); /*Se o topo foi menor ou igual a 0(limitação da div), o topo vai pegar a direção inversão e não vai conseguir sair da limitação. O mesmo vale para a descida, naspróximas linhas.*/
                } 
            }

            
            if (jogo.pressionou[TECLA.S]) {
                
                var topo = parseInt($("#jogador").css("top"));
                $("#jogador").css("top",topo+10); /*Movendo para baixo*/ 

                if (topo>=434) {	
                    $("#jogador").css("top",topo-10);
                        
                }
                
            }
            
            if (jogo.pressionou[TECLA.D]) {
                
                //Chama função Disparo	
                disparo(); /*Afunção disparo não pode ser chamada no looping porque depende de uma ação específica.*/ 
            }
        
            } // fim da função movejogador()

         function moveinimigo1() {

             posicaoX = parseInt($("#inimigo1").css("left"));
             $("#inimigo1").css("left",posicaoX-velocidade); /*posicaoX - 5. Andando 5 unidades apra a esquerda*/
            $("#inimigo1").css("top",posicaoY);
                    
             if (posicaoX<=0) { /*Quando o helicóptero chegar no canto da tela, ele vai aparecer em um lugar randômico do Y.*/ 
             posicaoY = parseInt(Math.random() * 334);
             $("#inimigo1").css("left",694); /*Aqui, teremos o helicóptero reiniciando.*/
             $("#inimigo1").css("top",posicaoY);
                        
                 }
            } //Fim da função moveinimigo1()

            function moveinimigo2() {
                posicaoX = parseInt($("#inimigo2").css("left"));
                $("#inimigo2").css("left",posicaoX-3);
                            
                    if (posicaoX<=0) {
                        
                    $("#inimigo2").css("left",775);
                                
                    }
        } // Fim da função moveinimigo2()

        function moveamigo() {
	
            posicaoX = parseInt($("#amigo").css("left"));
            $("#amigo").css("left",posicaoX+1);
                        
                if (posicaoX>906) {
                    
                $("#amigo").css("left",0);
                            
                }
        
        } // fim da função moveamigo()

        function disparo() {
	
            if (podeAtirar==true) {
            
            somDisparo.play();
            podeAtirar=false; /*Isso daqui é para o usuário não poder executar um outro tiro enquanto o atual não suma da tela.*/
            
            topo = parseInt($("#jogador").css("top")) //Para o tiro seguir o jogador.
            posicaoX= parseInt($("#jogador").css("left"))
            tiroX = posicaoX + 100; //Posição horizontal inicial do tiro.
            topoTiro=topo+25; /*Configurando onde vai ser o local inicial do tiro em relação ao helicóptero.*/ //Note que a variável topo também vai servir para guirar a direção do tiro.
            $("#fundoGame").append("<div id='disparo'></div"); /*Mesma coisa lá de cima. Estamos iniciando o conteúdo html e css*/ 
            $("#disparo").css("top",topoTiro);
            $("#disparo").css("left",tiroX);
            
            var tempoDisparo=window.setInterval(executaDisparo, 30); /*Comando para criar uma função de tempo. Executa disparo a cada 30 milisegundos*/
            
            } //Fecha podeAtirar

            function executaDisparo() {
                posicaoX = parseInt($("#disparo").css("left"));
                $("#disparo").css("left",posicaoX+20); /*Atualizando a posição inicial do disparo e seta o intervalo do posicionamento.*/
        
                 if (posicaoX>900) { //Se for maior que isso, o disparo some
                    
                 //Removendo a div da tela quando o tiro sumir.
                    window.clearInterval(tempoDisparo);
                    tempoDisparo=null; //É necessário indicar que a variável está null em alguns browsers senão o intervalo lá d ecima nunca será cancelaado.
                    $("#disparo").remove();
                    podeAtirar=true;
                            
                           }
            } // Fecha executaDisparo()

        } // Fecha disparo()

        function colisao() {
            var colisao1 = ($("#jogador").collision($("#inimigo1"))); //Aqui é a variável que indica que o jogardor está colidindo com o inimigo1
            var colisao2 = ($("#jogador").collision($("#inimigo2")));
            var colisao3 = ($("#disparo").collision($("#inimigo1")));
            var colisao4 = ($("#disparo").collision($("#inimigo2")));
            var colisao5 = ($("#jogador").collision($("#amigo")));
            var colisao6 = ($("#inimigo2").collision($("#amigo")));

                // jogador com o inimigo1
                
            if (colisao1.length>0) {
            
                energiaAtual--; //A variável energia sendo subtraída na colisão.
                inimigo1X = parseInt($("#inimigo1").css("left")); //Capturando a posição atual do inimigo
                inimigo1Y = parseInt($("#inimigo1").css("top"));
                explosao1(inimigo1X,inimigo1Y);
            
                posicaoY = parseInt(Math.random() * 334); //Aqui é para o inimigo reaparecer depois da explosão
                $("#inimigo1").css("left",694);
                $("#inimigo1").css("top",posicaoY);
                }

            // jogador com o inimigo2 
            if (colisao2.length>0) {
                
                energiaAtual--; //A variável energia sendo subtraída na colisão.
                inimigo2X = parseInt($("#inimigo2").css("left"));
                inimigo2Y = parseInt($("#inimigo2").css("top"));
                explosao2(inimigo2X,inimigo2Y);
                        
                $("#inimigo2").remove();
                    
                reposicionaInimigo2(); //Função vai fazer o inimigo2 aparecer mais lentamente. A função foi chamada aqui pois deu um problema no firefox
        
    }	
                
            // Disparo com o inimigo1
            
            if (colisao3.length>0) {
                
            velocidade = velocidade + 0.5;
            pontos=pontos+100;
            inimigo1X = parseInt($("#inimigo1").css("left"));
            inimigo1Y = parseInt($("#inimigo1").css("top"));
                            
            explosao1(inimigo1X,inimigo1Y);
            $("#disparo").css("left",950); //Para que o disparo não continue a caminhar na tela.
                            
            posicaoY = parseInt(Math.random() * 334);
            $("#inimigo1").css("left",694);
            $("#inimigo1").css("top",posicaoY);
                            
            }
                    

                // Disparo com o inimigo2
                
            if (colisao4.length>0) {
                
                
                pontos = pontos + 50;
                inimigo2X = parseInt($("#inimigo2").css("left"));
                inimigo2Y = parseInt($("#inimigo2").css("top"));
                $("#inimigo2").remove();
            
                explosao2(inimigo2X,inimigo2Y);
                $("#disparo").css("left",950);
                
                reposicionaInimigo2();
                    
                }

            // jogador com o amigo
                
            if (colisao5.length>0) {
                
                salvos++;
                somResgate.play();
                reposicionaAmigo();
                $("#amigo").remove();
                }

                
            //Inimigo2 com o amigo
                
            if (colisao6.length>0) {
                
            perdidos++;
            amigoX = parseInt($("#amigo").css("left"));
            amigoY = parseInt($("#amigo").css("top"));
            explosao3(amigoX,amigoY);
            $("#amigo").remove();
                    
            reposicionaAmigo();
                    
            }

        
        } //Fim da função colisao()

        function explosao1(inimigo1X,inimigo1Y) {
            somExplosao.play();
            $("#fundoGame").append("<div id='explosao1'></div");
            $("#explosao1").css("background-image", "url(imgs/explosao.png)");
            var div=$("#explosao1");
            div.css("top", inimigo1Y);
            div.css("left", inimigo1X);
            div.animate({width:200, opacity:0}, "slow"); //Função do JQuery. Ela vai crescer até 200 e vai sumindo até o 0 na velocidade lenta. Claro, que pegando antes o valor inicial no css.
                
            var tempoExplosao=window.setInterval(removeExplosao, 1000);
                
                function removeExplosao() {
                        
                    div.remove();
                    window.clearInterval(tempoExplosao);
                    tempoExplosao=null;
                        
                    }
                    
           } // Fim da função explosao1()

           //Reposiciona Inimigo2
	
	function reposicionaInimigo2() {
	
        var tempoColisao4=window.setInterval(reposiciona4, 5000);
            
        function reposiciona4() {
        window.clearInterval(tempoColisao4);
        tempoColisao4=null; //Zeranndo a variável para ela poder sumir
                
            if (fimdejogo==false) { //Se o jogo acabar, o inimigo2 não vai reaparecer. //Se o fim de jogo for true, ele não vai aparecer. 
                $("#fundoGame").append("<div id=inimigo2></div");
                
                }
                
            }	
        }	

    //Explosão2
	
	function explosao2(inimigo2X,inimigo2Y) {
        somExplosao.play();
        $("#fundoGame").append("<div id='explosao2'></div");
        $("#explosao2").css("background-image", "url(imgs/explosao.png)");
        var div2=$("#explosao2");
        div2.css("top", inimigo2Y);
        div2.css("left", inimigo2X);
        div2.animate({width:200, opacity:0}, "slow");
        
        var tempoExplosao2=window.setInterval(removeExplosao2, 1000);
        
            function removeExplosao2() {
            
            div2.remove();
            window.clearInterval(tempoExplosao2);
            tempoExplosao2=null;
            
            }
            
            
        } // Fim da função explosao2()

        //Explosão3
	
    function explosao3(amigoX,amigoY) {
        somPerdido.play();
        $("#fundoGame").append("<div id='explosao3' class='anima4'></div");
        $("#explosao3").css("top",amigoY);
        $("#explosao3").css("left",amigoX);
        var tempoExplosao3=window.setInterval(resetaExplosao3, 1000);

        function resetaExplosao3() { //Resetando a explosão
        $("#explosao3").remove();
        window.clearInterval(tempoExplosao3);
        tempoExplosao3=null;
                
        }
    
    } // Fim da função explosao3

        //Reposiciona Amigo
	
	function reposicionaAmigo() {
	
        var tempoAmigo=window.setInterval(reposiciona6, 6000);
        
            function reposiciona6() {
            window.clearInterval(tempoAmigo);
            tempoAmigo=null;
            
            if (fimdejogo==false) {
            
            $("#fundoGame").append("<div id='amigo' class='anima3'></div>");
            
            }
            
        }
        
    } // Fim da função reposicionaAmigo()
    

    function placar() {
	
        $("#placar").html("<h2> Pontos: " + pontos + " Salvos: " + salvos + " Perdidos: " + perdidos + "</h2>"); //Recuperando no DOM. Aqui, também estamos fazendo uma concatenação básica.
        
    } //fim da função placar()

    //Barra de energia

    function energia() {
        
        if (energiaAtual==3) { //Se a energia atual for igual a 3 o JQuery vai resgatar essa imagem na div. Issso vai servir apra as seguintes.
            
            $("#energia").css("background-image", "url(imgs/energia3.png)");
        }

        if (energiaAtual==2) {
            
            $("#energia").css("background-image", "url(imgs/energia2.png)");
        }

        if (energiaAtual==1) {
            
            $("#energia").css("background-image", "url(imgs/energia1.png)");
        }

        if (energiaAtual==0) {
            
            $("#energia").css("background-image", "url(imgs/energia0.png)");
            
            //Game Over
            gameOver(); //A função game over não vai ser chamada no loop, obviamente.
        }

} // Fim da função energia()

    //Função GAME OVER
    function gameOver() {
        fimdejogo=true;
        musica.pause();
        somGameover.play();
        
        window.clearInterval(jogo.timer); //Parando as funções de tempo do jogo. Parando os loops.
        jogo.timer=null;
        
        $("#jogador").remove();
        $("#inimigo1").remove();
        $("#inimigo2").remove();
        $("#amigo").remove();
        
        $("#fundoGame").append("<div id='fim'></div>"); //Criando uma nova div no id #fundogame
        
        $("#fim").html("<h1> Game Over </h1><p>Sua pontuação foi: " + pontos + "</p>" + "<div id='reinicia' onClick=reiniciaJogo()><h3>Jogar Novamente</h3></div>");
        
    } // Fim da função gameOver();


} // Fim da função start

    //Reinicia o Jogo
            
    function reiniciaJogo() {
        somGameover.pause();
        $("#fim").remove();
        start();
        
    } //Fim da função reiniciaJogo

    


