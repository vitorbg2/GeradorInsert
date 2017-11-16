/**
 * Created by Vitor on 11/10/2017.
 */
var qtd_colunas; // Variavel global de controle das colunas do insert.

var colunas_parametros = ['2','4','5','6','10','11']; // Quais colunas que necessitam de parâmetros ?


var nomes = Array('Alice','Miguel','Sophia','Artur','Davi','Pedro','Bernado','Manuela','Isabella','Valentina','Giovanna','Heitor',
    'Rafael','Rafaela','Matheus','Enzo','Nicolas','Samuel','Theo','Lara','Mariana','Ana Clara','João Pedro','João Lucas','Pedro',
    'Yasmin','Leticia','Benjamin','Isaac','Joaquim','Lucca','Caio','Vinicius','Vitor','Vicente','Maria','Bianca','Larissa','Rebecca',
    'Thiago','Thomas','Enrico','Amanda','Ana','Esther','Bryan','Murilo','Daniel','Danilo','Geraldo','Carolina','Paulo','Wesley');

var sobrenomes = Array('Alves', 'Monteiro','Novaes', 'Mendes', 'Barros', 'Freitas', 'Barbosa', 'Pinto', 'Moura', 'Cavalcanti', 'Dias', 'Castro', 'Campos',
'Cardoso', 'Silva', 'Souza', 'Costa', 'Santos', 'Oliveira', 'Pereira', 'Rodrigues', 'Almeida', 'Nascimento', 'Lima', 'Araújo',
'Fernandes', 'Carvalho', 'Gomes', 'Martins', 'Rocha', 'Ribeiro', 'Rezende', 'Sales', 'Peixoto', 'Fogaça', 'Porto', 'Ribeiro',
'Duarte', 'Moraes', 'Ramos', 'Pereira', 'Ferreira', 'Silveira', 'Moreira', 'Teixeira', 'Caldeira', 'Vieira', 'Nogueira',
'da Costa', 'da Rocha', 'da Cruz', 'da Cunha', 'da Mata', 'da Rosa', 'da Mota', 'da Paz', 'da Luz', 'da Conceição', 'das Neves',
'Fernandes', 'Gonçalves', 'Rodrigues', 'Martins', 'Lopes', 'Gomes', 'Mendes', 'Nunes', 'Carvalho', 'Melo', 'Cardoso',
'Pires', 'Jesus', 'Aragão', 'Viana', 'Farias');



$(document).ready(
    function () {


        $('#addcoluna').click(  //Quando você quer adcionar colunas, é adcionado conteudo HTML na pagina de acordo com a quantidade necessitada
            function () {
                var qtd =document.getElementById('qtd').value;  //Recebe a quantidade de colunas desejada
                qtd_colunas = qtd; // Passa o valor para a variavel global
                var destino = document.getElementById('colunas'); //
                destino.innerHTML = "";
                destino.innerHTML += "<label>Colunas</label>"

                for (var i=0;i<qtd;i++) { // a cada repetição adciona o HTML para se criar um novo input de COLUNA
                    destino.innerHTML += "<div class='form-inline'>"+
                        "<input class='form-control' type='text' id='coluna"+(i+1)+"' placeholder='Coluna"+(i+1)+"'/>"+
                        "<select class='form-control' id='tipo"+(i+1)+"'>"+
                        "<option value='1'>String</option>"+
                        "<option value='2'>Inteiro/FK</option>"+
                        "<option value='3'>String c/ Num</option>"+
                        "<option value='4'>Data</option>"+
                        "<option value='5'>Inteiro/PK</option>"+
                        "<option value='6'>String/Variado</option>"+
                        "<option value='7'>Nome</option>"+
                        "<option value='8'>CPF</option>"+
                        "<option value='9'>Placa Veicular</option>"+
                        "<option value='10'>Data C/</option>"+
                        "<option value='11'>Foreign Key C/</option>"+
                        "</select>"+
                        "</div><br>"

                }
            }
        );

        $('#enviar').click( // Botão de enviar contido no formulario do gerador de inserts
            function (){
                var qtd_inserts = document.getElementById('numinserts').value; // Valor do campo input "Qtd Inserts"
                var qtd = qtd_colunas; // Recebe a quantidade de colunas da variavel global
                var valor_coluna = Array(); // Array que irá armazenar os argumentos do input de uma coluna, posteriomente se transforma em VALUE na query
                var tipo_coluna = Array(); // tipo da coluna : string, int, etc, recebe do select
                var resultado = "<p>"; //Resultado final do insert posteriomente transformado em HTML.
                var tabela = document.getElementById('tabela').value; //Nome da tabela
                var coluna; // Apenas para armazenar o nome da coluna.
                var insert="INSERT INTO "+tabela+" ("; // Variavel que monta a QUERY
                for (var i=1;i<=qtd;i++) { // Laço será executado n vezes, sendo n o número de colunas do insert

                    //#tipo+i , Representa o ID do campo select que foi gerado no HTML da pagina
                    tipo_coluna[i-1] = $('#tipo'+i).val();//Recebe o tipo da coluna selecionado, tipo_coluna[0] recebe #tipo1.val, tipo_coluna[1] recebe #tipo2.val, assim por diante
                    //Sendo #tipo+i.val() um inteiro

                    if (colunas_parametros.indexOf(tipo_coluna[i-1]) != -1) { // Verifica se a coluna é uma coluna que necessita de argumentos
                        coluna = document.getElementById('coluna'+i).value; //Recebe o nome da coluna referente a iteração do laço
                        var dividir = coluna.split(','); //Divide a coluna entre nome da coluna e argumentos
                        coluna = dividir[0]; //Fica armazenado apenas o nome da coluna
                        valor_coluna[i-1] = dividir[1]; //Fica armazenado apenas os argumentos que a coluna leva
                    }
                    else { // Se não existir argumentos apenas acrescenta o nome da coluna na query
                        coluna = document.getElementById('coluna'+i).value;
                        valor_coluna[i-1] = document.getElementById('coluna'+i).value;
                    }

                    if (i == qtd)
                        insert += coluna;
                    else
                        insert += coluna+",";

                }
                insert += ")";

                var values = "VALUES (";
                var valor;
                for (var i=1;i<=qtd_inserts;i++) { //Laço para gerar os inserts, n iterações sendo n a quantidade de inserts
                    for (var j=0;j<qtd;j++) { // Laço que gera os values de cada coluna
                        valor = '';
                        if (tipo_coluna[j] == 1){ //String que apenas utiliza o proprio nome da coluna como value, acrescentando um valor iterativo na frente do nome
                            valor ="'"+valor_coluna[j] + i+"'";
                        }
                        else if(tipo_coluna[j] == 2){ //Inteiro/FK, Também pode ser usado como numero aleatorio
                            var intervalo = valor_coluna[j].split('-');
                            valor = Math.floor(Math.random()*(intervalo[1]-intervalo[0]))+parseInt(intervalo[0]);
                        }
                        else if(tipo_coluna[j] == 3){ //String c/ Num
                            var num = Math.floor(Math.random()*100000)+9999;
                            valor = "'"+num+(num*2)+"'";
                        }
                        else if(tipo_coluna[j] == 4){ //Data Aleatoria
                            var anos = valor_coluna[j].split('-'); //Separa os argumentos
                            var data = dataAleatoria(anos[0],anos[1]);
                            valor ="'"+data.getDate()+"/"+(data.getMonth()+1)+"/"+data.getFullYear()+"'";
                        }
                        else if(tipo_coluna[j] == 5){ // Primary Key, intervalo de n ate a quantidade de inserts,
                            valor =parseInt(valor_coluna[j])+i-1;
                        }
                        else if(tipo_coluna[j] == 6){ // String porém com intervalos
                            var intervalo = valor_coluna[j].split('-');
                            var tam = intervalo.length;
                            var aleatorio = Math.floor(Math.random()*(tam));
                            valor ="'"+intervalo[aleatorio]+"'";

                        }
                        else if (tipo_coluna[j] == 7){ //Nome Aleatorio com base nas arrays: nome,sobrenome
                            var tam_nome = nomes.length;
                            var tam_snome = sobrenomes.length;
                            var indicenome = Math.floor(Math.random()*(tam_nome));
                            var indicesnome = Math.floor(Math.random()*(tam_snome));
                            valor ="'"+nomes[indicenome]+" "+sobrenomes[indicesnome]+"'";
                        }
                        else if (tipo_coluna[j] == 8){ //Gera o CPF e armazena em formato STRING

                            valor = "'"+geraCpf()+"'";
                        }
                        else if (tipo_coluna[j] == 9){ //Gera a Placa Veicular e armazena em formato STRING

                            valor = geraPlacaVeicular();

                        }
                        else if (tipo_coluna[j] == 10){ // Data Customizada, Parametro falso irá retornar a data e hora atual, parametro True retornara uma data daqui a n dias
                            var futuro = valor_coluna[j];
                            valor = geraDataCustomizada(futuro);
                        }
                        else if (tipo_coluna[j] == 11){ //
                            var div= valor_coluna[j].split('-');
                            var tabela = div[0];
                            var coluna = div[1];
                            valor ="( SELECT "+coluna+ //Monta a query para fazer um select iterativo para servir de FK.
                                    " FROM "+tabela+
                                    " ORDER BY "+coluna+" OFFSET "+(i-1)+" rows FETCH NEXT 1 ROWS ONLY )";
                        }
                        if (j+1 == qtd)
                            values += valor;
                        else
                            values += valor + ",";
                    }
                    values += ");"
                    resultado +=insert +"<br>"+values+"<br>";
                    values = "VALUES (";
                }
                resultado += "</p>";
                document.getElementById('resultado').innerHTML +="<br>"+ resultado;


            }
        );

        $('#limpar').click(
            function () {
                document.getElementById('resultado').innerHTML = "";
            }
        );


    }
);

function dataAleatoria(anoinicio,anofim) { // Função que retorna uma data aleatoria
    anoinicio = parseInt(anoinicio);
    anofim = parseInt(anofim);
    var dataIni = new Date(anoinicio, 0, 1);
    var dataFim = new Date(anofim,0,1);
    return new Date(dataIni.getTime() + Math.random() * (dataFim.getTime() - dataIni.getTime()));
}

function gera_random(n) {
    var ranNum = Math.floor(Math.random()*n);
    return ranNum;
}
function mod(dividendo,divisor) {
    return Math.round(dividendo - (Math.floor(dividendo/divisor)*divisor));
}
function geraCpf(){
    var n = 9;
    var n1 = gera_random(n);
    var n2 = gera_random(n);
    var n3 = gera_random(n);
    var n4 = gera_random(n);
    var n5 = gera_random(n);
    var n6 = gera_random(n);
    var n7 = gera_random(n);
    var n8 = gera_random(n);
    var n9 = gera_random(n);
    var d1 = n9*2+n8*3+n7*4+n6*5+n5*6+n4*7+n3*8+n2*9+n1*10;
    d1 = 11 - (mod(d1,11));
    if (d1>=10) d1 = 0;
    var d2 = d1*2+n9*3+n8*4+n7*5+n6*6+n5*7+n4*8+n3*9+n2*10+n1*11;
    d2 = 11 - (mod(d2,11));
    if (d2>=10) d2 = 0;


    return ''+n1+n2+n3+'.'+n4+n5+n6+'.'+n7+n8+n9+'-'+d1+d2;
}

function geraPlacaVeicular(){
    //CharCode -- 65 a 90 = Alfabeto
    var placa ='';
    for (var i=0;i<3;i++){
        var random = gera_random(25) + 65; // Gerado de 0 a 25 depois somado com 65, ou seja, aleatorio de 65 a 90
        placa += String.fromCharCode(random); //Transforma o codigo em caracter
    }
    placa += '-'+(gera_random(8999)+1000); // Aleatorio de 1000 a 9999
    return placa;
}

function geraDataCustomizada(futuro){ // Espera-se 0 ou 1 no parametro
    if (futuro == false){
        return "CONVERT(datetime, GETDATE(), 103)";
    } else{
        return "CONVERT(datetime, DATEADD(DAY,7, GETDATE()), 101)";
    }
}
