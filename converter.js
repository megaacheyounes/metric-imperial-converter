var m = require('convert-units');
var _=require('lodash');
var converter = {};

const returnUnits= {
  km:'mi',
  mi:'km',
  kg:'lb',
  lb:'kg',
  gal:'l',
  l:'gal' 
};

const tr= {
  km:'kilometers',
  mi:'miles',
  kg:'kilogrames',
  lb:'pounds',
  gal:'galons',
  l:'liters' 
};

converter.valunit={
  initNum:0,
  initUnit:'',
  returnUnit:0,
  returnUnit:'!',
  raw:''
};


var message;

converter.convert = (input)=>{
  
  var invalid_unit=false;
  converter.valunit.raw=input;
  if(!converter.getUnit())
    invalid_unit=true;

  if(!converter.getVal())
    if(invalid_unit)
      return message='invalid number and unit';
    else 
      return message='invalid number';
  else
    if(invalid_unit)
      return message='invalid unit';
    
  converter.valunit.returnNum = m(converter.valunit.initNum).from(converter.valunit.initUnit).to(converter.valunit.returnUnit).toFixed(5);
  return message='200';
}

converter.getUnit=()=>{
  
  converter.valunit.initUnit = /[a-zA-Z]+$/.exec(converter.valunit.raw)[0].toLowerCase().replace('lbs','lb');
  converter.valunit.returnUnit = returnUnits[converter.valunit.initUnit];
  console.log('return unit',converter.valunit.returnUnit);
  if(!converter.valunit.returnUnit)
    return false;
  return true;
}

converter.getVal = ()=>{
  
  var unitIndex=  converter.valunit.raw.toLowerCase().indexOf(converter.valunit.initUnit);

  var val= converter.valunit.raw.substring(0,unitIndex);
  
  if(!isNaN(val))    
    converter.valunit.initNum=val===''?1:val;
  else
    converter.valunit.initNum=converter.calculateNum(val);
  
  if(isNaN(converter.valunit.initNum))    
    return false;
  
  console.log('analysis:',converter.valunit.raw,'>unit:',converter.valunit.initUnit,'>val:',converter.valunit.initNum);
  return true;
}

converter.calculateNum = (val)=>{
  if(val.indexOf('/')===-1)
      return 'nan';
  var slashIndex=val.indexOf('/');
  var a = val.substring(0,slashIndex);
  var b= val.substring(slashIndex+1);  
  return a/b;
}

converter.displayRes = (res)=>{
  if(message!=='200')
   return res.status(400).json(message);
    
  var clone = _.clone(converter.valunit,true);
  clone.initNum=Number(clone.initNum);
  clone.returnNum=Number(clone.returnNum);

  clone.initUnit =  clone.initUnit.replace('lb','lbs');
  clone.returnUnit = clone.returnUnit.replace('lb','lbs');
  clone.string=clone.initNum+' '+tr[clone.initUnit]+' converts to '+clone.returnNum+' '+tr[clone.returnUnit];
  res.json(_.omit(clone,['raw']));
}
module.exports = converter;
