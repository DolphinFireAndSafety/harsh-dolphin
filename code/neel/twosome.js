var twoSum = function(nums, target) {

    nums.forEach((element,index)=>{
        let checkedValue = {};
        const presentValue = element;
        const neededValue = target-presentValue;
        const findVal = checkedValue[neededValue] ;
        console.log(presentValue,neededValue,findVal)
        if(findVal != null ){
            console.log("done")
            return [findVal,index]
        }else{
            checkedValue[neededValue] = index;
        }
    })

};
twoSum( [2,7,11,15],9)