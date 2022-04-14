let fs = require('fs');
let googleTTS = require('google-tts-api');
let http = require('https'); 
let {PythonShell} = require('python-shell');

var is_speaking = false;
var is_dialog = false;

function InitMoneyList(){
	global.moneyJSON = '';
	http.get("https://www.cbr-xml-daily.ru/latest.js", (a)=>{a.on('data',(b)=>{global.moneyJSON += b.toString("utf8");})})
}

function Need_A_Dialog(text){
	if(is_dialog && !is_speaking){ 
		return Need_An_Action(text);
	} else if(text[0].includes("двер")){
		is_dialog = true;
		setTimeout(function(){is_dialiog=false;}, 10000);
		return Need_An_Action(text);
	}
}

function Need_An_Action(text){
	//console.log("action selected!");
	if(text.find(e=>(
		e.includes("сделай") ||
		e.includes("включи") ||
		e.includes("кажи") ||
		e==="произнеси" ||
		e.includes("поставь") ||
		e.includes("узнай") ||
		e.includes("смотри") ||
		e.includes("найди") ||
		e.includes("как") ||
		e.includes("котор") ||
		e.includes("точн") ||
		e.includes("скольк")
	))) return Action_Selector(text);
}

function Is_A_Question(text){
	if(text.find(e=>(
		e.includes("как",3) ||
		e.includes("котор",5) ||
		e.includes("когд",4) ||
		e.includes("скольк", 6) ||
		e === "где"
	))) return true; else return false;
}

function Action_Selector(text){
	//console.log("action passed!");
	if(text.find(e=>(
		e.includes("врем") ||
		e === "час" ||
		(e.includes("час") && e==="сколько")
	))) return Say_Current_Time(text);
	if(text.find(e=>(e==="курс"))) return Say_Valute_Course(text);	
}

function GetValuteCode(text){
	if(text.find(e=>(e.includes("тенг")))) return 'KZT';
	if(text.find(e=>(e.includes("драм")))) return 'AMD';
	if(text.find(e=>(e.includes("лев")))) return 'BGN';
	if(text.find(e=>(e.includes("реал")))) return 'BRL';
	if(text.find(e=>(e.includes("форинт")))) return 'HUF';
	if(text.find(e=>(e.includes("евр")))) return 'EUR';
	if(text.find(e=>(e.includes("руп")))) return 'INR';
	if(text.find(e=>(e.includes("сом")))) return 'KGS';
	if(text.find(e=>(e.includes("юан")))) return 'CNY';
	if(text.find(e=>(e.includes("злот")))) return 'PLN';
	if(text.find(e=>(e.includes("сомон")))) return 'TJS';
	if(text.find(e=>(e.includes("лир")))) return 'TRY';
	if(text.find(e=>(e.includes("сум")))) return 'UZS';
	if(text.find(e=>(e.includes("грив")))) return 'UAH';
	if(text.find(e=>(e.includes("франк")))) return 'CHF';
	if(text.find(e=>(e.includes("рэнд")))) return 'ZAR';
	if(text.find(e=>(e.includes("вон")))) return 'KRW';
	if(text.find(e=>(e.includes("йен")))) return 'JPY';
	if(text.find(e=>(e.includes("фунт")))) return 'GBP';
	
	if(text.find(e=>(e.includes("рубл")))){
		if(text.find(e=>(e.includes("белорус")))) return 'BYN';
		return 'RUB';
	}
	
	if(text.find(e=>(e.includes("манат")))){
		if(text.find(e=>(e.includes("туркм")))) return 'TMT';
		return 'AZN';
	}
	
	if(text.find(e=>(e.includes("ле")))){
		if(text.find(e=>(e.includes("румын")))) return 'RON';
		return 'MDL';
	}
	
	if(text.find(e=>(e.includes("крон")))){
		if(text.find(e=>(e.includes("норв")))) return 'NOK';
		if(text.find(e=>(e.includes("датск")))) return 'DKK';
		if(text.find(e=>(e.includes("швед")))) return 'SEK';
		return 'CZK';
	}
	
	if(text.find(e=>(e.includes("долл")))){
		if(text.find(e=>(e.includes("австрал")))) return 'AUD';
		if(text.find(e=>(e.includes("гонконг")))) return 'HKD';
		if(text.find(e=>(e.includes("канадс")))) return 'CAD';
		if(text.find(e=>(e.includes("сингап")))) return 'SGD';
		return 'USD';
	}
}

function Say_Valute_Course(text){
	console.log("AA>");
	var ValFirst = 'RUB';
	var ValScnd = 'USD';
	var is_made = true;
	for(var i=0;i<text.length;i++){
		if(text[i]=='к'){
			is_made = false;
			ValScnd = GetValuteCode(text.slice(2,i));
			ValFirst = GetValuteCode(text.slice(i+1,text.lenght));
			break;
		}
	}
	if(is_made){var a = GetValuteCode(text); if(a)ValScnd=a;}
	console.log(ValFirst, ValScnd);
	//console.log("SS" + global.moneyJSON);
	var json = JSON.parse(global.moneyJSON);
	var a = ValFirst != 'RUB' ? json["rates"][ValFirst]:1;
	var b = ValScnd != 'RUB' ? json["rates"][ValScnd]:1;
	return "Текущий курс " + Math.round(a/b * 100) / 100 + " за единицу";
}

function Say_Current_Time(words){
	console.log("time selected!");
	let date = new Date(); 
	var STtext = date.getHours().toString()+(date.getHours()%10==1&&date.getHours()!=11? " час" : (((date.getHours()%10==2||date.getHours()%10==3||date.getHours()%10==4)&&date.getHours()!=12&&date.getHours()!=13&&date.getHours()!=14)? " часа": " часов"))
	+" "+date.getMinutes().toString()+(date.getMinutes()%10==1&&date.getMinutes()!=11? " минута" : (((date.getMinutes()%10==2||date.getMinutes()%10==3||date.getMinutes()%10==4)&&date.getMinutes()!=12&&date.getMinutes()!=13&&date.getMinutes()!=14)? " минуты": " минут"));
	if(words.find(e=>(e.includes("точное")))) {
		STtext +=" "+date.getSeconds().toString()+(date.getSeconds()%10==1&&date.getSeconds()!=11? " секунда" : (((date.getSeconds()%10==2||date.getSeconds()%10==3||date.getSeconds()%10==4)&&date.getSeconds()!=12&&date.getSeconds()!=13&&date.getSeconds()!=14)? " секунды": " секунд"));
	}
	return STtext;
}

async function playsound(conn, stream){
	if(!is_speaking){
		is_speaking = true;
		const dispatcher = conn.play(stream);
		dispatcher.on('finish', () => { console.log(`Played!\n`); is_speaking = false;}); 
		return true;
	} else return false;
}

async function answerFrame(conn, out) {
	console.log(`>> ${out}`);
	var STtext;
	const words = out.toLowerCase().split(' ');
	STtext = Need_A_Dialog(words);
	console.log(STtext);
	if(STtext){
	http.get(googleTTS.getAudioUrl(STtext,{lang: 'ru',slow: false,host: 'https://translate.google.com',timeout: 10000,}),function(a){while(!playsound(conn, a));});}
}

const createNewChunk = (addon) => {
    const pathToFile = __dirname + `/../recordings/${addon}.pcm`;
    return fs.createWriteStream(pathToFile);
};

function startwork(conn){
	http.get(googleTTS.getAudioUrl("Привет, кожанные мешки!",{lang: 'ru',slow: false,host: 'https://translate.google.com',timeout: 10000,}),function(a){while(!playsound(conn, a));});
	const receiver = conn.receiver;
	InitMoneyList();
	conn.on('speaking', (user, speaking) => {
		if (speaking) {
			const audioStream = receiver.createStream(user, { mode: 'pcm' });
			var addon = Date.now();
			audioStream.pipe(createNewChunk(addon));
			audioStream.on('end', () => { 
				let options = {
				  mode: 'text',
				  pythonOptions: ['-u'],
				  scriptPath: '.',
				  args: addon
				};					
				PythonShell.run('recogniser.py', options, function (err, out) {
					if (err) throw err;
					if(out!=null){
						answerFrame(conn, out[0]);
					}
				});
			});
		}
	});
}

exports.enter = function(msg) {
	const cmd = msg.content.split(' ');
	//var mat = false;
	var voiceChannel;
	for(var i=0;i<cmd.length;i++)if(cmd[i].toLowerCase() === 'в' && cmd[i+1]){voiceChannel = msg.guild.channels.cache.filter(c => c.type === "voice" || c.type === "stage").find(channel =>(channel.name.toLowerCase() === cmd[i+1].toLowerCase()));break;};
	if (!voiceChannel) voiceChannel = msg.member.voice.channel;
	if (!voiceChannel || (voiceChannel.type !== 'voice' && voiceChannel.type !== 'stage'))
        return msg.reply("Дверька не может найти такой канал :(");
    console.log(`Int:${voiceChannel.name}`);
    voiceChannel.join()
        .then(conn => {startwork(conn);})
        .catch(err => {throw err;});
}

exports.exit = function (msg) {
    if(msg.guild.voiceStates.cache.filter(a => a.connection !== null).size !== 1)
        return;
	var voicemsg;
	const cmd = msg.content.split(' ');
    if(cmd.find(e=>(e.toLowerCase()=="вийди"||e.toLowerCase()=="выйди"))&&cmd.find(e=>e.toLowerCase()=="отсюда")&&cmd.find(e=>(e.toLowerCase()=="розбийник"||e.toLowerCase()=="разбойник"))) voicemsg="сам выйди отсюда";
    const { channel: voiceChannel, connection: conn } = msg.guild.voiceStates.cache.last();
    //const dispatcher = conn.play(__dirname + "/../sounds/badumtss.mp3", { volume: 0.45 });
    //dispatcher.on("finish", () => {
        voiceChannel.leave();
        console.log(`\nSTOPPED RECORDING\n`);
    //});
};