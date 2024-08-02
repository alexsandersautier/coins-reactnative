import "reflect-metadata"
import { Alert, FlatList, Pressable, Text, View } from 'react-native';
import { CoinEntity } from "@/database/entities/CoinEntity";
import { dataSource } from "@/database/useDatasource";
import { useEffect, useState } from "react";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';


export default function Index(){
  useEffect(() => {
    const connect = async () => {
      if (!dataSource.isInitialized) {
        await dataSource.initialize();
      }
    }
    connect().then(()=> getAll());
  }, []);
    const [data, setData] = useState<CoinEntity[]>([]);
    const getData = () => {fetch("https://economia.awesomeapi.com.br/last/BTC-USD").then(
        (res) => res.json()
      ).then(async (json) => {
        const coin = new CoinEntity();
        coin.name = json.BTCUSD.name;
        coin.value = json.BTCUSD.bid;
        try {
          
          await dataSource.manager.save(coin);
        } catch (error) {
          console.log(error)
        }
        return coin;
        
      }).then((item) => console.log(item)).then(() => getAll())};

      const getAll = async () =>  {
        const result = await dataSource.getRepository(CoinEntity).find();
        setData(result);
      }
      const deleteById = async (item: CoinEntity) => {
        Alert.alert('Delete', `deseja deletar este item? ${item.value}`,[
          {
            text: 'Cancel',
            onPress: () => getAll(),
            style: 'cancel',
          },
          {text: 'OK', 
            onPress: async () => {
            const result = await dataSource.getRepository(CoinEntity).find({where: {id: item.id}});
            for (const item of result) {
              await dataSource.getRepository(CoinEntity).remove(item);
            }
            getAll();
          }},
        ])
        
        
      }
    return(
        <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
            <Text>BitCoin para Dólar</Text>
            <Pressable onPress={getData}>
              <Text style={
                  {
                    backgroundColor: "blue", 
                    color: "white", 
                    paddingVertical:5, 
                    paddingHorizontal:5,
                    marginVertical: 5,
                    cursor: "pointer"
                  }
                }>Cotação atual</Text>
            </Pressable>
            <FlatList
              data={data}
              renderItem={({item}) => <View>
                <Text style={
                    {
                      display: "flex",
                      alignItems: "center", 
                      justifyContent: "center"
                    }
                  }
                >{item.name}: {item.value} - {item.createdAt.toDateString()}
                  <Pressable onPress={()=>deleteById(item)}>
                    <MaterialIcons name="delete" size={24} color="black" />
                  </Pressable>
                </Text>
              </View>}
              keyExtractor={(item) => item.id.toString()}
            />
        </View>
    )
}