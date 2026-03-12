const helperMain = {
    tryCatch: async (code, res = null) => {
        // res argument is important to be there if used for routers
        try {
            await code()
        } catch (error) {
            console.error(error);
            if (!res) { return { error } };
            return res.status(500).json({ error: "internal server error" });
        }
    },
    removeElementArr:(value,arr)=>{
        const newArr = []
        try {
            for (let index = 0; index < arr?.length; index++) {
                const element = arr[index];
                if(element !== value){
                    newArr.push(element)
                }
            }
        } catch (error) {
            console.log(error);
        }
        return newArr;
    }
}


module.exports = helperMain;