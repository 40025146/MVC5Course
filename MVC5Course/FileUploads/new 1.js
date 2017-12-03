//Creator:Panda
//Name:tltc_Exception_CreateWork
//Type:JavaScript
//Event:[Exception work order] => action
//Comments:v0.1 Developed By Panda @Broadway 2017/11/24
//============================================================
var isGetError=false;
var GetVariableProcess = function (var_name) {
    var strVal = GetVariable(var_name);
    return strVal;
}
var GetVariable = function (var_name) {
    var varibleItem = inn.newItem("Variable", "get");
    varibleItem.setProperty("name",var_name);
    varibleItem = varibleItem.apply();
    if (varibleItem.isError()) {
        alert("取得變數值失敗" + var_name);
    } else {
        //console.log(varibleItem.ToString());
        return varibleItem.getProperty("value", "");
    }
    return "";
}
var GetProcessByName = function (process_name) {
    var ProcessItem = inn.newItem("cn_process", "get");
    ProcessItem.setProperty("cn_no", process_name);
    ProcessItem = ProcessItem.apply();
    if (ProcessItem.isError()) {
        return null;
    } else {
        return ProcessItem
    }
}
var GetCADObjectByPartItemNumber = function (Part_ItemNumber) {
    var strArr = Part_ItemNumber.split('-');
    var aml = "<AML>\
                    <Item isNew='1' isTemp='1' type='CAD' action='get' where=\"[CAD].cn_hproductno='" + Part_ItemNumber + "' \">\
                    <Relationships>\
                        <Item type='CAD autonomy' action='get'>\
                        </Item>\
                        <Item type='CAD size' action='get'>\
                        </Item>\
                    </Relationships>\
                    </Item>\
                </AML>";
   
    var item = inn.applyAML(aml);
    if (item.isError() == true) {
        //alert(Part_ItemNumber + "沒有對應CAD圖之半成品料號");
        isGetError=true;
    } else {
        isGetError=false;
        return item;
    }
    return null;
}
var GetCheckListByCnProcessIdBall = function (CnProcessId, Product_ItemNumber,work_type) {
    var checklist = null;
    var checkItem = null;
    var cn_process = null;
    var finalCheckItems = null;
    var str_Product = Product_ItemNumber.substring(0, 2);
    try {
        if (CnProcessId != "") {
            finalCheckItems = inn.newItem();
            checklist = inn.newItem("checklist_template", "get");
            work_type=work_type.trim();
            switch (work_type) {
                case "F":
                case "B":
                case "D":
                    checklist.setProperty("cn_process", CnProcessId);
                    break;
                case "L":
                case "K":
                    checklist.setProperty("cn_process", CnProcessId);
                    break;
                case "G":
                    checklist.setAttribute("where", "[checklist_template].cn_process='" + CnProcessId + "'  and [checklist_template].cn_plm like '%" + str_Product + "%' ");
                    break;
                case "H":
                    checklist.setAttribute("where", "[checklist_template].cn_process='" + CnProcessId + "'  and [checklist_template].cn_plm like '%" + str_Product + "%' ");
                    break;
                case "C":
                     checklist.setProperty("cn_process", CnProcessId);
                    break;
                case "R":
                     checklist.setProperty("cn_process", CnProcessId);
                    break;
                case "S":
                    checklist.setProperty("cn_process", CnProcessId);
                    break;
                case "V":
                    checklist.setProperty("cn_process", CnProcessId);
                    break;
            }
            

            checklist = checklist.apply();
            if (checklist.isError() == false) {
                for (var i = 0; i < checklist.getItemCount() ; i++) {
                    var checklitItem = checklist.getItemByIndex(i);
                    checkItem = inn.newItem("c checkitemsa", "get");
                    checkItem.setAttribute("where", "[c_checkitemsa].source_id ='" + checklitItem.getProperty("id", "") + "'");
                    checkItem = checkItem.apply();
                    if (checkItem.isError()==true) continue;
                    for (var j = 0; j < checkItem.getItemCount() ; j++) {
                        var checkItm = checkItem.getItemByIndex(j);
                        var related_id = checkItm.getRelatedItem();
                        if (related_id.getProperty("cn_checkcode", "") != "") {
                            if (related_id.getProperty("cn_checkcode").indexOf("球標流水號") > -1) {
                                finalCheckItems.appendItem(related_id);
                            }
                        }
                        
                    }
                }
            }
        }
        //console.log(finalCheckItems.ToString());
        return finalCheckItems;
    } catch (ex) {
        console.log("讀取自主檢查表錯誤:" + ex.toString())
    }

}
var GetCheckListByCnProcessId = function (CnProcessId,Product_ItemNumber, work_type) {
    var checklist = null;
    var str_Product = Product_ItemNumber.substring(0,2);
    var aml = "";
    work_type=work_type.trim();
    //console.log(CnProcessId+","+Product_ItemNumber+","+work_type);
    
    //H段增加條件
    switch (work_type) {
        case "F":
        case "B":
        case "D":
            checklist = inn.newItem("checklist_template", "get");
            checklist.setProperty("cn_process", CnProcessId);
            checklist = checklist.apply();
            break;
        case "L":
        case "K":
            checklist = inn.newItem("checklist_template", "get");
            checklist.setProperty("cn_process", CnProcessId);
            checklist = checklist.apply();
            break;
        case "G":
            aml = "<AML>\
                 <Item type='checklist_template' action='get' where=\"[checklist_template].cn_process='"+ CnProcessId + "'  and [checklist_template].cn_plm like '%" + work_type + "%' \">\
                </Item>\
                </AML>";
            checklist = inn.applyAML(aml);
            break;
        case "H":
            //Update by panda 2017.10.12 12:06 更新H段找產品大類且有ALL的
            aml = "<AML>\
                 <Item type='checklist_template' action='get' where=\"[checklist_template].cn_process='" + CnProcessId + "'  and ( [checklist_template].cn_plm like '%" + work_type + "%'   OR CHECKLIST_TEMPLATE.CN_PLM ='ALL')  \">\
                </Item>\
                </AML>";
            checklist = inn.applyAML(aml);
            break;
        case "C":
            checklist = inn.newItem("checklist_template", "get");
            checklist.setProperty("cn_process", CnProcessId);
            checklist = checklist.apply();
            break;
        case "R":
            aml = "<AML>\
                 <Item type='checklist_template' action='get' where=\"[checklist_template].cn_process='"+ CnProcessId + "'  and [checklist_template].cn_plm like '%" + work_type + "%' \">\
                </Item>\
                </AML>";
            checklist = inn.applyAML(aml);
            break;
        case "S":
            aml = "<AML>\
                 <Item type='checklist_template' action='get' where=\"[checklist_template].cn_process='" + CnProcessId + "'  and ( [checklist_template].cn_plm like '%" + work_type + "%'   OR CHECKLIST_TEMPLATE.CN_PLM ='ALL')  \">\
                </Item>\
                </AML>";
            checklist = inn.applyAML(aml);
            break;
        case "V":
            aml = "<AML>\
                 <Item type='checklist_template' action='get' where=\"[checklist_template].cn_process='" + CnProcessId + "'  and ( [checklist_template].cn_plm like '%" + work_type + "%'   OR CHECKLIST_TEMPLATE.CN_PLM ='ALL')  \">\
                </Item>\
                </AML>";
            checklist = inn.applyAML(aml);
            break;
    }
    if (checklist.isError() == true) {
        error_msg +=" "+work_type+"自主檢查表錯誤:"+ checklist.getErrorString()+"<br>";
    }
    return checklist;
}
var GetIssueNumber=function(){
    var cn_ql=thisItem.getProperty("cn_ql","");
    var qlItem=inn.getItemById("cn_questionlist",cn_ql);
    if(qlItem.isError()==false){
        return qlItem.getProperty("item_number","");
    }else{
        return "";
    }
}
var GetSeq=function(cn_no){
    var tmp_number=cn_no;
    for(var i=1;i<100;i++){
        tmp_number=cn_no;
        tmp_number=tmp_number+"_"+i;
        var itm=inn.newItem("work order","get");
        itm.setProperty("cn_no",tmp_number);
        itm=itm.apply();
        if(itm.isError()==true){
            return i;
        }
        console.log("cn_no"+tmp_number);
        
    }
    return "";
}
var GetDate=function(){
    var d = new Date();
    var strDaytime="";
    strDaytime = d.getFullYear().toString().substring(2, 4);
    if (d.getMonth()+1 < 10) {
        strDaytime += "0" + (d.getMonth()+1).toString();
    } else {
        strDaytime += (d.getMonth() + 1).toString();
    }
    
    var day = d.getDate().toString();
    
    if (parseInt(day) < 10) {
        strDaytime += "0" + d.getDate().toString(); 
    } else {
        strDaytime += d.getDate().toString();
    }
    return strDaytime;
}
var GetCADProcess=function(cadObj){
    var str_list="";
     var cad_list = cadObj.getItemsByXPath("Relationships//Item[@type='CAD autonomy']");
     
     for (var k = 0; k < cad_list.getItemCount() ; k++) {
         var cad_relatedObj = cad_list.getItemByIndex(k);
         str_list+=cad_relatedObj.getProperty("cn_process", "");
         if(k+1<cad_list.getItemCount()){
             str_list+=",";
         }
     }
     return str_list;
}
var NewCreateWork=function(part_id,cn_inputs){
    var part=inn.getItemById("part",part_id);
    try{
    if(part.getProperty("cn_prod_stage","").trim()==""){
        alert(part.getProperty("item_number","")+"未填寫生產階段");
        return;
    }
    if(part.getProperty("cn_fproductno","")==""){
        alert(part.getProperty("item_number","")+"未填寫半成品編號");
        return;
    }
    console.log("尋找流水號");
    cn_no=part.getProperty("item_number","").trim()+"_"+GetIssueNumber()+"_"+GetDate();
    cn_no=cn_no+"_"+GetSeq(cn_no);
    
    console.log("建立物件AML");
    var strAML = "<AML>\
        <Item type='work order' action='add'>\
            <cn_no>"+ cn_no + "</cn_no>\
            <cn_part>"+part_id + "</cn_part>\
            <cn_inputs>" + cn_inputs + "</cn_inputs>\
            <cn_plan_start_date>" + thisItem.getProperty("cn_plan_start_date", "") + "</cn_plan_start_date>\
            <cn_plan_comp_date>" + thisItem.getProperty("cn_plan_comp_date", "") + "</cn_plan_comp_date>\
            <Relationships>";
    console.log("建立BOM");
   var PartBOM = inn.applyAML("<AML><Item type='Part BOM' action='get' where=\"[Part_BOM].source_id='" + part_id + "'\"></Item></AML>");
    if (PartBOM.isError() == false) {
        for (var k = 0; k < PartBOM.getItemCount() ; k++) {
            var itmPart = PartBOM.getItemByIndex(k);
            strAML += "<Item type=\'w bom\' action=\'add\'>";
            strAML += "<cn_material>" + itmPart.getProperty("related_id", "") + "</cn_material>";
            strAML += "<cn_materialu>" + itmPart.getProperty("quantity", "") + "</cn_materialu>";
            strAML += "</Item>";
        }
    }         
            
    console.log("建立CAD");
    var cadObjList = GetCADObjectByPartItemNumber(part.getProperty("cn_fproductno",""));

    if (cadObjList != null && isGetError != true) {
        if(cadObjList.isError()==true){
            alert(part.getProperty("item_number","")+"找不到CAD圖之半成品編號");
            return;
        }
        for (var cadObjListCount = 0; cadObjListCount < cadObjList.getItemCount() ; cadObjListCount++) {
            var cadObj = cadObjList.getItemByIndex(cadObjListCount);
            //w_cad
            strAML += "<Item type=\'w cad\' action=\'add\'>";
            strAML += "<related_id>" + cadObj.getProperty("id", "") + "</related_id>";
            strAML += "</Item>";
            console.log("CAD count="+cadObjListCount);
            if(cadObjListCount!=0)continue;
            //w_size
            var cad_list = cadObj.getItemsByXPath("Relationships//Item[@type='CAD size']");
            console.log("建立CAD尺寸檢查");
            for (var k = 0; k < cad_list.getItemCount() ; k++) {
                var cad_relatedObj = cad_list.getItemByIndex(k);
                //展開尺寸檢查代碼
                var cn_checklist = GetCheckListByCnProcessIdBall(cad_relatedObj.getProperty("cn_process", ""), part.getProperty("item_number",""),part.getProperty("cn_prod_stage",""));
                
                var cn_checklistCount = 0;
                if (cn_checklist != null) {
                    if (cn_checklist.isError() == false) cn_checklistCount = cn_checklist.getItemCount();
                    console.log("cn_checklistCount="+cn_checklistCount);
                    for (var count = 0; count < cn_checklistCount; count++) {
                        if (cn_checklist.isError() == false) {
                            var cn_checklistObj = cn_checklist.getItemByIndex(count);
                            if (cn_checklistObj.getProperty("cn_checkcode", "") == "") continue;
                            strAML += "<Item type=\'w size\' action=\'add\'>";
                            strAML += "<cn_process>" + cad_relatedObj.getProperty("cn_process", "") + "</cn_process>";
                            strAML += "<cn_standard>" + cad_relatedObj.getProperty("cn_standard", "") + "</cn_standard>";
                            strAML += "<cn_lspecifications>" + cad_relatedObj.getProperty("cn_lspecifications", "") + "</cn_lspecifications>";
                            strAML += "<cn_specifications>" + cad_relatedObj.getProperty("cn_specifications", "") + "</cn_specifications>";
                            strAML += "<cn_standard>" + cad_relatedObj.getProperty("cn_standard", "") + "</cn_standard>";


                            var cn_checkcode = cn_checklistObj.getProperty("cn_checkcode", "");
                            cn_checkcode = cn_checkcode.replace("球標流水號", cad_relatedObj.getProperty("cn_ballmark", ""));
                            cn_checkcode = cn_checkcode + "-" + cadObj.getProperty("item_number", "");
                            strAML += "<cn_checkcode>" + cn_checkcode + "</cn_checkcode>";
                            strAML += "<cn_checkitem>" + cn_checklistObj.getProperty("cn_checkitem", "") + "</cn_checkitem>";
                            strAML += "</Item>";
                        }
                    }
                }
            }
            //w_autonomy
            var cn_process_list ="";
            var cn_process_is_id=false;
            var cn_checklist_IsFile="";
            var 
            switch (part.getProperty("cn_prod_stage","").trim()) {
                case "F":
                case "B":
                case "D":
                    cn_process_list = GetCADProcess(cadObj);
                    cn_process_is_id=true;
                    break;
                case "L":
                case "K":
                    cn_process_list = GetCADProcess(cadObj);
                    cn_process_is_id=true;
                    break;
                case "G":
                    cn_process_list = GetVariableProcess("cn_g_process");
                    cn_checklist_IsFile="Y";
                    break;
                case "H":
                    cn_process_list = GetVariableProcess("cn_h_process");
                    cn_checklist_IsFile="Y";
                    break;
                case "C":
                     cn_process_list = GetCADProcess(cadObj);
                     cn_process_is_id=true;
                    break;
                case "R":
                     cn_process_list = GetCADProcess(cadObj);
                     cn_process_is_id=true;
                    break;
                case "S":
                    cn_process_list = GetVariableProcess("cn_s_process");
                    cn_checklist_IsFile="Y";
                    break;
                case "V":
                    cn_process_list = GetVariableProcess("cn_v_process");
                    cn_checklist_IsFile="Y";
                    break;
            }
            console.log("建立CAD製程");
            if (cn_process_list != "" ) {
                var strProcessArr = cn_process_list.split(",");
                for (var i = 0; i < strProcessArr.length; i++) {
                    var cn_checklist=null;
                    var strProcess_id="";
                    if(cn_process_is_id==true){
                        strProcess_id=strProcessArr[i];
                        cn_checklist = GetCheckListByCnProcessId(strProcess_id, part.getProperty("item_number",""),part.getProperty("cn_prod_stage",""));
                    }else{
                        var ProcessItem = GetProcessByName(strProcessArr[i]);
                        if (ProcessItem == null) continue;
                        if (ProcessItem.isError()) continue;
                        strProcess_id=ProcessItem.getProperty("id", "");
                        cn_checklist = GetCheckListByCnProcessId(ProcessItem.getProperty("id", ""), part.getProperty("item_number",""),part.getProperty("cn_prod_stage",""));
                    }

                    var cn_checklistCount = 0;
                    if (cn_checklist.isError() == false) cn_checklistCount = cn_checklist.getItemCount();
                    for (var count = 0; count < cn_checklistCount; count++) {
                        var cn_checklistObj = cn_checklist.getItemByIndex(count);
                        //if (cn_checklistObj.getProperty("cn_autonomousno", "") == "") continue;
                        strAML += "<Item type=\'w autonomy\' action=\'add\'>";
                        strAML += "<cn_process>" + strProcess_id + "</cn_process>";
                        
                        if(cn_checklist_IsFile=="Y"){
                            strAML += "<cn_checklist>"+ cad_relatedObj.getProperty("cn_checklist", "")+"</cn_checklist>";
                        }
                        else{
                            strAML += "<cn_checklist>Y</cn_checklist>";
                        } 
                        if (cn_checklist.isError() == false) {

                            strAML += "<cn_autonomousno>" + cn_checklistObj.getProperty("cn_autonomousno", "") + "</cn_autonomousno>";
                        } else {
                            strAML += "<cn_autonomousno></cn_autonomousno>";
                        }
                         if (part.getProperty("cn_prod_stage","").trim() == "B") {
                            var cn_size3 = cadObj.getProperty("cn_size3", "");
                            var cn_processItem = inn.newItem("cn_process", "get");
                            cn_processItem.setProperty("id", cad_relatedObj.getProperty("cn_process", ""));
                            cn_processItem = cn_processItem.apply();
                            var cn_process_name = cn_processItem.getProperty("cn_no", "");
                            //銅排付款代號介於下限~上限之間
                            var copperAML = "<AML><Item type=\"Copper\" action=\"get\" select=\"cn_workcode,cn_attributes,cn_low,cn_up,cn_uprice\" where=\"[Copper].cn_attributes=\'" + cn_process_name + "\' and [Copper].cn_low &lt; " + cn_size3 + " and [Copper].cn_up &gt;= " + cn_size3 + "\"></Item></AML>";
                            var copperItem = inn.applyAML(copperAML);
                            if (copperItem.isError() == false) {
                                strAML += "<cn_workcode>" + copperItem.getProperty("cn_workcode", "") + "</cn_workcode>";
                                strAML += "<cn_uprice>" + copperItem.getProperty("cn_uprice", "") + "</cn_uprice>";
                            }
                        }
                        strAML += "</Item>";
                    }
                }
            }
        }
    }else{
        alert(part.getProperty("item_number","")+"讀取CAD圖錯誤:"+"\r\n1.找不到CAD圖之半成品編號\r\n2.不存在此CAD物件");
        return ;
    }
    
    strAML += "</Relationships></Item>\
        </AML>";
        var wo_itm = inn.applyAML(strAML);
        if (wo_itm.isError() == true) {
            alert(part.getProperty("item_number","")+"產生工單錯誤:"+wo_itm.getErrorString());
            return;
        } else {
            var WOA_WO_relationship = inn.newItem("E work order", "add");
            WOA_WO_relationship.setProperty("source_id", thisItem.getProperty("id",""));
            WOA_WO_relationship.setProperty("related_id", wo_itm.getProperty("id", ""));
            WOA_WO_relationship = WOA_WO_relationship.apply();
        }
        
        return true;
    }catch(ex){
        alert(ex.toString());
        return false;
    }
}


var inn = new Innovator();
var error_msg="";


if(thisItem.fetchLockStatus()!=0){
    alert("尚未解鎖");
    return;
}

alert("按下確認後開始執行");
var semipart_relationship=inn.newItem("E semipart","get");
semipart_relationship.setProperty("source_id",thisItem.getProperty("id",""));
semipart_relationship=semipart_relationship.apply();


for(var i=0 ; i< semipart_relationship.getItemCount();i++){
    var semipartItem=semipart_relationship.getItemByIndex(i);
    var part_id=semipartItem.getProperty("cn_part","");
    var cn_inputs=semipartItem.getProperty("cn_count","");
    var cn_is_create_work=semipartItem.getProperty("cn_is_create_work","");
    console.log(part_id+","+cn_inputs);
    if(part_id!=="" && cn_inputs!=="" && cn_is_create_work=="0"){
        var boolSuccess=NewCreateWork(part_id,cn_inputs);
        if(boolSuccess==true){
            semipartItem.setProperty("cn_is_create_work","1");
            semipartItem=semipartItem.apply("edit");
        }
    }
}
top.aras.uiReShowItem(thisItem.getProperty("id"),thisItem.getProperty("id"),"view",'tab view');

alert("執行結束");

