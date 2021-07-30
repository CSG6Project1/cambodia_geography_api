import express from 'express'
import fuzzysearch from 'fuzzy-search'
import Place from '../models/placeModels.js'
const router = express.Router()

//link: filterplaces/result?type=&province_code=&district_code=&commune_code=&village_code=
//type=type, province_code = province_code , district_code = district_code, commune_code = commune_code, village_code = village_code
router.get("/result",(req,res)=>{
    Place.find((err,docs)=>{
        if(!err){
            let province_search;
            let district_search;
            let commune_search;
            let village_search;
            console.log("__________________________________")
            console.log("place: " + req.query['type'])
            console.log("province code: " + req.query['province_code'])
            console.log("district code: " + req.query['district_code'])
            console.log("commune code: " + req.query['commune_code'])
            console.log("village code: " + req.query['village_code'])
            function searching(obj,field,key){
                const searcher = new fuzzysearch(obj,[field],{caseSensitive: true})
                const result = searcher.search(key)
                return result;
            }
            if (req.query['type'] == "place"){
                let place_search=searching(docs,'type',req.query['type'])
                if(place_search.length != 0){
                    if(req.query['province_code'] == "null" || req.query['province_code'] == null){
                        province_search = place_search
                    }
                    else{
                        province_search=searching(place_search,'province_code',req.query['province_code'])
                    }    
                    if(province_search.length != 0){
                        if(req.query['district_code'] == "null" || req.query['district_code'] == null){
                            district_search = province_search
                        }
                        else{
                            district_search=searching(province_search,'district_code',req.query['district_code'])
                        } 
                        if (district_search.length != 0){
                            if(req.query['commune_code'] == "null" || req.query['commune_code'] == null){
                                commune_search = district_search
                            }
                            else{
                                commune_search=searching(district_search,'commune_code',req.query['commune_code'])
                            }
                            if(commune_search.length != 0){
                                if(req.query['village_code'] == "null" || req.query['village_code'] == null){
                                    village_search = commune_search
                                }
                                else{
                                    village_search=searching(commune_search,'village_code',req.query['village_code'])
                                }                                
                                if(village_search.length != 0){
                                    res.json(village_search)                                    
                                }
                                else{
                                    res.send({ message: "no data not found in this village"})                                    
                                }
                            }
                            else{
                                res.send({ message: "no data not found in this commune"})                              
                            }
                        }
                        else{
                            res.send({ message: "no data not found in this district"})
                        }
                    }
                    else
                        res.send({ message: "no data not found in this province"})
                }
                else{
                    res.send({ message: "Data not found"})
                }                           
            }
            else if (req.query['type'] == "restaurant"){
                let place_search=searching(docs,'type',req.query['type'])
                if(place_search.length != 0){
                    if(req.query['province_code'] == "null" || req.query['province_code'] == null){
                        province_search = place_search
                    }
                    else{
                        province_search=searching(place_search,'province_code',req.query['province_code'])
                    }    
                    if(province_search.length != 0){
                        if(req.query['district_code'] == "null" || req.query['district_code'] == null){
                            district_search = province_search
                        }
                        else{
                            district_search=searching(province_search,'district_code',req.query['district_code'])
                        } 
                        if (district_search.length != 0){
                            if(req.query['commune_code'] == "null" || req.query['commune_code'] == null){
                                commune_search = district_search
                            }
                            else{
                                commune_search=searching(district_search,'commune_code',req.query['commune_code'])
                            }
                            if(commune_search.length != 0){
                                if(req.query['village_code'] == "null" || req.query['village_code'] == null){
                                    village_search = commune_search
                                }
                                else{
                                    village_search=searching(commune_search,'village_code',req.query['village_code'])
                                }                                
                                if(village_search.length != 0){
                                    res.json(village_search)                                    
                                }
                                else{
                                    res.send({ message: "no data not found in this village"})                                    
                                }
                            }
                            else{
                                res.send({ message: "no data not found in this commune"})                              
                            }
                        }
                        else{
                            res.send({ message: "no data not found in this district"})
                        }
                    }
                    else
                        res.send({ message: "no data not found in this province"})
                }
                else{
                    res.send({ message: "Data not found"})
                }                  
            }
            else{
                res.send({ message: "Data not found"})
            }
        }
        else{ 
            res.send({ message: "Place model error"})
        }
    })
});

export default router