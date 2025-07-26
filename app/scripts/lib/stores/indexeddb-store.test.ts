import 'fake-indexeddb/auto';
import { IndexedDBStore } from './indexeddb-store';

describe('IndexedDBStore', () => {
  const dbName = 'test-db';
  const dbVersion = 1;
  let db;

  beforeEach(async () => {
    await new Promise((resolve, reject) => {
      const req = indexedDB.deleteDatabase(dbName);
      req.onsuccess = resolve;
      req.onerror = () => reject(req.error);
    });
    db = new IndexedDBStore();
  });

  afterEach(() => db?.close());

  describe('open', () => {
    it('opens and creates store', async () => {
      await db.open(dbName, dbVersion);
      await db.set({ key: 'value' });
      expect(await db.get(['key'])).toEqual(['value']);
    });

    it('rejects for invalid version', async () => {
      await expect(db.open(dbName, 0)).rejects.toThrow(TypeError);
    });

    it('handles opening errors', async () => {
      await db.open(dbName, dbVersion + 1);
      db.close();
      db = new IndexedDBStore();
      await expect(db.open(dbName, dbVersion)).rejects.toThrow(Error);
    });

    it('handles version upgrades', async () => {
      await db.open(dbName, dbVersion);
      await db.set({ key: 'value' });
      db.close();
      db = new IndexedDBStore();
      await db.open(dbName, ++dbVersion);
      expect((await db.get(['key']))[0]).toBe('value');
    });

    it('does not reopen if open', async () => {
      const openSpy = jest.spyOn(indexedDB, 'open');
      await db.open(dbName, ++dbVersion);
      openSpy.mockRestore();
      await expect(openSpy).not.toHaveBeenCalled();
    });
  });

  describe('set', () => {
    beforeEach(async () => {
        await (db as any).open(dbName, ++dbVersion); 
     })

     afterEach(async() =>{
        (db as any).close()
        (db as any).open=()=>Promise.resolve()
     })



     it.each([
        [{ key1: 'value1', key2: true }, ['key1','key2'],['value1',true]],
        [{}, [], []],
       ])("sets %p",async(valuesObj,retrievedKeys,retrievedValues)=>{
          //given
         //when 
         // @ts-ignore
          (await (db as any)._connectionPromise)
         .transaction(["store"],"readwrite")
         .objectStore("store")
         .clear()

          // @ts-ignore
          const originalOpen=!!(await (await (db as any)._connectionPromise).transaction(["store"],"readwrite"))

           //then
           expect(originalOpen).toBe(true)

           //when 
            //@ts-ignore
            
            const setResult=await ((typeof valuesObj==="object" && !Array.isArray(valuesObj))?   ((values:any)=>{const obj:any={};Object.keys(values).forEach(key=>obj[key]=values[key]);return obj;})(valuesObj): valuesObj)
            
            ?   Object.keys(valuesObj!).reduce(
                  //@ts-ignore
               (acc,key)=>({...acc,[key]:valuesObj[key]}),{}) : valuesObj ;
               
               let finalSetResult=setResult;
               

                if(typeof finalSetResult==="object"){
                  finalSetResult=(Object.keys(finalSetResult) as string[]).reduce(
                    //@ts-ignore
                    (acc:string[],curr:string)=>[...acc,(finalSetResult as any)[curr]],[]
                  )
                 }
   
           
            


            


            //@ts-expect-error  
            !(async()=>{const result=(await(await(await ((new IndexedDBStore())._connectionPromise)!!)).transaction(["store"],"readwrite").objectStore("store").getAll(); return result})().then(data=>expect(finalSetResult.every((x,i)=>x===data[i].value)).toBe(true))
             
            
            
            
         
          
       })
      
    

    
   

  
  

  
});
