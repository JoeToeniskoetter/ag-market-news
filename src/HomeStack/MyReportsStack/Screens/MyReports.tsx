import FontAwesome from 'react-native-vector-icons/FontAwesome'
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useIsFocused } from "@react-navigation/native";
import React, { useContext, useEffect, useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View, Platform, Dimensions, Alert } from "react-native";
import { ListItem, Text, SearchBar } from "react-native-elements";
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { MyReportsContext } from "../../../Providers/MyReportsProvider";
import { Report } from '../../../Providers/SearchProvider';
import { MyReportsNavProps } from "../MyReportsStackParams";
import { NoSavedReports } from "../../SearchStack/Screens/components/NoSavedReports";
import { BannerAd, BannerAdSize, TestIds } from '@react-native-firebase/admob';


export function ReportsScreen({ navigation, route }: MyReportsNavProps<"Reports">) {
  const { reports, removeReport } = useContext(MyReportsContext);
  const [searchText, setSearchText] = useState<string>('');
  const [filteredReports, setFilteredReports] = useState<Report[] | null>();
  const [showAdd, setShowAdd] = useState<boolean>(true);

  const adUnitId = Platform.OS == 'ios' ? 'ca-app-pub-8015316806136807/9105033552' : 'ca-app-pub-8015316806136807/4483084657';


  function filterReports(text: string) {
    setSearchText(text)

    if (text === '' || undefined) {
      return setFilteredReports(null)
    }
    const filtered = reports?.filter((report: Report) => {
      return report.report_title.toLowerCase().includes(searchText.toLowerCase()) || report.slug_name.toLowerCase().includes(searchText.toLowerCase())
    });

    setFilteredReports(filtered);
  }

  return (
    <>
      <View style={styles.container}>
        <Text style={{ paddingBottom: '5%', paddingLeft: '5%' }} h2>My Reports</Text>
        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', width: '100%', height: '20%' }}>
          <SearchBar
            placeholder="Search for report..."
            platform={Platform.OS == "ios" ? "ios" : "android"}
            clearIcon
            onChangeText={(text: string) => { filterReports(text) }}
            value={searchText}
            onClear={() => { filterReports('') }}
            onCancel={() => { filterReports('') }}
          />
        </View>
        <View style={{ height: '75%' }}>
          {reports?.length === 0 ? <NoSavedReports /> :
            <FlatList
              data={filteredReports ? filteredReports : reports}
              keyExtractor={item => item.slug_name}
              renderItem={({ item }) => (
                <Swipeable renderRightActions={() => (
                  <TouchableOpacity
                    onPress={async () => {
                      await removeReport(item.slug_name);
                    }}
                  >
                    <View style={styles.rightButton}>
                      <FontAwesome name="trash" size={24} color="white" />
                      <Text style={styles.actionText}>Remove</Text>
                    </View>
                  </TouchableOpacity>
                )}>
                  <ListItem bottomDivider
                    onPress={() => {
                      navigation.navigate("PDFView", { report: item })
                    }}
                  >
                    {item.report_url?.includes('pdf') ? <AntDesign name="pdffile1" size={24} color={'black'} /> : <AntDesign name="filetext1" size={24} color={'black'} />
                    }
                    <ListItem.Content>
                      <ListItem.Title>{item.report_title}</ListItem.Title>
                      <ListItem.Subtitle style={{ fontWeight: 'bold' }}>{`Report ID: ${item.slug_name}`}</ListItem.Subtitle>
                    </ListItem.Content>
                    <ListItem.Chevron />
                  </ListItem>
                </Swipeable>
              )}
            />
          }
        </View>
      </View>
      {showAdd ? 
        <View style={{backgroundColor:'white'}}>
          <BannerAd
            unitId={__DEV__ ? TestIds.BANNER : adUnitId}
            size={BannerAdSize.FULL_BANNER}
            requestOptions={{
              requestNonPersonalizedAdsOnly: true,
            }}
            onAdFailedToLoad={(e: any) =>{
              setShowAdd(false)
            }}
            onAdClosed={() => {}}
            onAdLoaded={()=>{ 
              setShowAdd(true)
            }}
            onAdOpened={()=>{}}
            onAdLeftApplication={()=>{}}
          />
        </View>
        : null}
    </>
  )
}


const styles = StyleSheet.create({
  card: {
    height: '20%',
    width: '100%',
    borderRadius: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 1,
  },
  gradient: {
    height: '100%',
    borderRadius: 10,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  icon: {
    width: 70,
    height: 70,
    marginLeft: '8%'
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: '15%',
    backgroundColor: 'white'
  },
  rightButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#dd2c00',
    height: '100%',
    padding: 20
  },
  actionText: {
    fontWeight: '600',
    color: '#fff',
  }
})