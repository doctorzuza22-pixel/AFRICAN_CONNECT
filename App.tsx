import React, { useMemo, useState } from 'react';
import { SafeAreaView, ScrollView, View, Text, TextInput, Pressable, StatusBar, StyleSheet } from 'react-native';

type Tab = 'Home' | 'Social' | 'Explore' | 'Business' | 'Profile';
const GOLD = '#D9B45B';
const MUTED = '#A9A49A';
const countries = ['South Africa', 'Ghana', 'Zimbabwe'];
const modules = [
  { icon: '◎', title: 'Social', sub: 'People, posts & community' },
  { icon: '▦', title: 'Business', sub: 'Discover trusted businesses' },
  { icon: '◇', title: 'Marketplace', sub: 'Shop from African sellers' },
  { icon: '✦', title: 'Services', sub: 'Everyday services in one place' },
  { icon: '♫', title: 'Music & entertainment', sub: 'Artists, radio & events' },
  { icon: '♡', title: 'Health', sub: 'Find care and health services' },
  { icon: '⌂', title: 'Cars & property', sub: 'Explore vehicles and homes' },
  { icon: '◈', title: 'Wallet & rewards', sub: 'Payments and rewards coming soon' },
  { icon: '盾', title: 'Safety centre', sub: 'Your privacy and protection' }
];
const demoBusinesses = [
  { name: 'Ubuntu Market', category: 'Groceries & household', country: 'South Africa', tag: 'Demo listing' },
  { name: 'Accra Style House', category: 'Fashion', country: 'Ghana', tag: 'Demo listing' },
  { name: 'Harare Auto Hub', category: 'Vehicles', country: 'Zimbabwe', tag: 'Demo listing' }
];
const demoProducts = [
  { name: 'Everyday backpack', price: 'R 349', category: 'Fashion', country: 'South Africa' },
  { name: 'Handwoven market basket', price: 'GH₵ 180', category: 'Home', country: 'Ghana' },
  { name: 'Wireless headphones', price: 'US$ 24', category: 'Electronics', country: 'Zimbabwe' }
];

function GoldButton({ title, onPress }: { title: string; onPress: () => void }) {
  return <Pressable onPress={onPress} style={s.goldButton}><Text style={s.goldButtonText}>{title}</Text></Pressable>;
}
function Header({ title, subtitle }: { title: string; subtitle?: string }) {
  return <View style={s.header}><Text style={s.brandSmall}>AC <Text style={{ color: GOLD }}>AFRICAN CONNECT</Text></Text><Text style={s.pageTitle}>{title}</Text>{subtitle ? <Text style={s.muted}>{subtitle}</Text> : null}</View>;
}
function Card({ children }: { children: React.ReactNode }) { return <View style={s.card}>{children}</View>; }

export default function App() {
  const [tab, setTab] = useState<Tab>('Home');
  const [country, setCountry] = useState('South Africa');
  const [query, setQuery] = useState('');
  const [cart, setCart] = useState(0);
  const [showWelcome, setShowWelcome] = useState(true);
  const [selectedModule, setSelectedModule] = useState('');
  const [liked, setLiked] = useState<number[]>([]);
  const [notice, setNotice] = useState('');
  const visibleBusinesses = useMemo(() => demoBusinesses.filter(x => (x.name + x.category + x.country).toLowerCase().includes(query.toLowerCase())), [query]);
  const visibleProducts = useMemo(() => demoProducts.filter(x => (x.name + x.category + x.country).toLowerCase().includes(query.toLowerCase())), [query]);

  const go = (next: Tab) => { setTab(next); setSelectedModule(''); setQuery(''); setNotice(''); };
  const modulePress = (name: string) => { setSelectedModule(name); setTab(name === 'Social' ? 'Social' : name === 'Business' ? 'Business' : 'Explore'); };
  const nav = ['Home', 'Social', 'Explore', 'Business', 'Profile'] as Tab[];

  if (showWelcome) return <SafeAreaView style={s.screen}><StatusBar barStyle="light-content" /><ScrollView contentContainerStyle={s.welcome}>
    <View style={s.logo}><Text style={s.logoLetters}>A<Text style={{ color: GOLD }}>C</Text></Text><Text style={s.logoAfrica}>AFRICA</Text></View>
    <Text style={s.wordmark}>african connect</Text><Text style={s.tagline}>CONNECTING AFRICAN COMMUNITIES</Text>
    <View style={{ height: 42 }} /><Text style={s.hero}>One Africa.{ '\\n' }One connection.</Text><Text style={s.mutedCenter}>Community, businesses, shopping and services — brought together.</Text>
    <Card><Text style={s.sectionTitle}>Choose your country</Text><View style={s.countryRow}>{countries.map(c => <Pressable key={c} onPress={() => setCountry(c)} style={[s.countryPill, country === c && s.countrySelected]}><Text style={[s.countryText, country === c && { color: '#17140D' }]}>{c}</Text></Pressable>)}</View><Text style={s.tiny}>Country selection is a setup preference in this preview, not identity verification.</Text></Card>
    <GoldButton title="Enter African Connect  →" onPress={() => setShowWelcome(false)} />
    <Text style={s.tiny}>Early access preview · Demo data only</Text>
  </ScrollView></SafeAreaView>;

  const content = () => {
    if (selectedModule && !['Social', 'Business'].includes(selectedModule)) return <><Header title={selectedModule} subtitle="A connected service, built for African communities."/><Card><Text style={s.sectionTitle}>Coming in future releases</Text><Text style={s.body}>We are preparing this area for trusted service providers and official partners. Listings, bookings and transactions will only become live when the required integrations and protections are in place.</Text><Text style={s.pill}>PARTNER INTEGRATION PLANNED</Text></Card><GoldButton title="Back to Explore" onPress={() => setSelectedModule('')} /></>;
    if (tab === 'Home') return <><Header title="Your Africa, connected." subtitle={country + ' · Welcome to the community'} /><Card style={undefined as any}><Text style={s.eyebrow}>THE AFRICAN CONNECT NETWORK</Text><Text style={s.heroSmall}>Discover. Connect. Grow.</Text><Text style={s.body}>A single place to find people, businesses and opportunities across Africa.</Text></Card><Text style={s.sectionTitle}>Explore the platform</Text><View style={s.grid}>{modules.map(m => <Pressable key={m.title} onPress={() => modulePress(m.title)} style={s.module}><Text style={s.moduleIcon}>{m.icon}</Text><Text style={s.moduleTitle}>{m.title}</Text><Text style={s.moduleSub}>{m.sub}</Text></Pressable>)}</View><Card><Text style={s.sectionTitle}>Built with trust in mind</Text><Text style={s.body}>Official partner checks, secure identity verification and protected payments will be added through authorised providers. Demo listings are not verified sellers.</Text></Card></>;
    if (tab === 'Social') return <><Header title="Community" subtitle="A sample social feed · Demo posts" /><Card><Text style={s.sectionTitle}>Share something with your community</Text><TextInput placeholder="What's happening?" placeholderTextColor={MUTED} style={s.input} onChangeText={setNotice} value={notice} /><GoldButton title="Preview post" onPress={() => setNotice('Your post preview is ready. Sign-in and publishing will be connected in a later release.')} />{notice ? <Text style={s.tiny}>{notice}</Text> : null}</Card>{['Good morning, Africa! What are you building this week?','Small businesses grow when communities support each other.','Share a local opportunity with your neighbourhood.'].map((p,i)=><Card key={i}><Text style={s.eyebrow}>COMMUNITY MEMBER · SAMPLE</Text><Text style={s.body}>{p}</Text><Pressable onPress={() => setLiked(a => a.includes(i) ? a.filter(v=>v!==i) : [...a,i])}><Text style={s.action}>{liked.includes(i) ? '♥ Liked' : '♡ Like'}  ·  Comment</Text></Pressable></Card>)}</>;
    if (tab === 'Business') return <><Header title="Business directory" subtitle="Discover businesses across participating countries" /><TextInput value={query} onChangeText={setQuery} placeholder="Search businesses or categories" placeholderTextColor={MUTED} style={s.input} />{visibleBusinesses.map(b=><Card key={b.name}><Text style={s.eyebrow}>{b.country.toUpperCase()}</Text><Text style={s.sectionTitle}>{b.name}</Text><Text style={s.body}>{b.category}</Text><Text style={s.pill}>{b.tag.toUpperCase()}</Text></Card>)}</>;
    if (tab === 'Explore') return <><Header title={selectedModule || 'Explore'} subtitle="Shopping and services across Africa" /><TextInput value={query} onChangeText={setQuery} placeholder="Search demo products" placeholderTextColor={MUTED} style={s.input} />{visibleProducts.map(p=><Card key={p.name}><Text style={s.eyebrow}>{p.country.toUpperCase()} · {p.category.toUpperCase()}</Text><Text style={s.sectionTitle}>{p.name}</Text><Text style={s.price}>{p.price}</Text><Text style={s.pill}>DEMO LISTING</Text><GoldButton title="Add to demo cart" onPress={() => { setCart(c=>c+1); setNotice('Added to your demo cart.'); }} /></Card>)}<Card><Text style={s.sectionTitle}>Your demo cart: {cart} item(s)</Text><Text style={s.tiny}>No real orders or payments are processed.</Text></Card></>;
    return <><Header title="Your profile" subtitle="Account preview" /><Card><Text style={s.sectionTitle}>Country</Text><View style={s.countryRow}>{countries.map(c=><Pressable key={c} onPress={()=>setCountry(c)} style={[s.countryPill,country===c&&s.countrySelected]}><Text style={[s.countryText,country===c&&{color:'#17140D'}]}>{c}</Text></Pressable>)}</View></Card><Card><Text style={s.sectionTitle}>Identity verification</Text><Text style={s.body}>Not connected. National ID numbers are not collected in this preview. Verification will require an authorised provider and your consent.</Text><Text style={s.pill}>NOT VERIFIED</Text></Card><Card><Text style={s.sectionTitle}>Privacy & safety</Text><Text style={s.body}>Your account controls, reporting and privacy choices will be expanded before public launch.</Text></Card></>;
  };

  return <SafeAreaView style={s.screen}><StatusBar barStyle="light-content" /><View style={s.appTop}><Text style={s.brandSmall}>AC <Text style={{color:GOLD}}>AFRICAN CONNECT</Text></Text><Text style={s.countryTop}>{country}</Text></View><ScrollView contentContainerStyle={s.content}>{content()}</ScrollView><View style={s.nav}>{nav.map(n=><Pressable key={n} onPress={()=>go(n)} style={s.navItem}><Text style={[s.navText,tab===n&&s.navActive]}>{n}</Text><View style={[s.navDot,tab===n&&{backgroundColor:GOLD}]} /></Pressable>)}</View></SafeAreaView>;
}

const s = StyleSheet.create({
 screen:{flex:1,backgroundColor:'#0D0D0C'}, welcome:{padding:24,paddingTop:48,paddingBottom:36,alignItems:'stretch',maxWidth:620,width:'100%',alignSelf:'center'}, content:{padding:20,paddingBottom:34,maxWidth:760,width:'100%',alignSelf:'center'}, logo:{height:112,width:142,borderWidth:1,borderColor:'#6F592B',borderRadius:22,alignSelf:'center',alignItems:'center',justifyContent:'center',backgroundColor:'#171511'},logoLetters:{fontSize:66,fontWeight:'800',color:'#F0D18A',letterSpacing:-8},logoAfrica:{fontSize:10,color:GOLD,letterSpacing:5,marginTop:-8},wordmark:{fontSize:31,color:'#F1E7D1',textAlign:'center',marginTop:18,fontWeight:'300',letterSpacing:-1},tagline:{fontSize:9,color:GOLD,textAlign:'center',letterSpacing:3,marginTop:8},hero:{fontSize:38,color:'#F5F0E6',fontWeight:'700',lineHeight:44,marginTop:12},heroSmall:{fontSize:27,color:'#F4E7C9',fontWeight:'700',marginTop:7},mutedCenter:{color:MUTED,textAlign:'center',lineHeight:23,marginTop:12,marginBottom:28},muted:{color:MUTED,fontSize:13,marginTop:5},header:{marginBottom:22},brandSmall:{color:'#E9E0D0',fontSize:12,fontWeight:'800',letterSpacing:1.5},pageTitle:{fontSize:29,color:'#F5F0E6',fontWeight:'700',marginTop:17},appTop:{height:58,paddingHorizontal:20,flexDirection:'row',alignItems:'center',justifyContent:'space-between',borderBottomWidth:1,borderBottomColor:'#25231F'},countryTop:{color:GOLD,fontSize:12},card:{backgroundColor:'#171715',borderColor:'#302D25',borderWidth:1,borderRadius:17,padding:17,marginBottom:13},sectionTitle:{fontSize:17,color:'#F4EBDD',fontWeight:'700',marginBottom:8},body:{fontSize:14,color:'#C7C1B5',lineHeight:21},eyebrow:{fontSize:9,color:GOLD,letterSpacing:1.6,fontWeight:'700',marginBottom:8},tiny:{fontSize:10,color:MUTED,lineHeight:16,marginTop:10},countryRow:{flexDirection:'row',flexWrap:'wrap',gap:8,marginVertical:9},countryPill:{borderWidth:1,borderColor:'#51462D',paddingHorizontal:12,paddingVertical:9,borderRadius:30},countrySelected:{backgroundColor:GOLD,borderColor:GOLD},countryText:{color:'#D8D0C2',fontSize:12},goldButton:{backgroundColor:GOLD,padding:15,borderRadius:12,alignItems:'center',marginTop:12},goldButtonText:{color:'#17140D',fontWeight:'800',fontSize:14},grid:{flexDirection:'row',flexWrap:'wrap',gap:10,marginBottom:17},module:{width:'48%',minHeight:126,backgroundColor:'#171715',borderColor:'#302D25',borderWidth:1,borderRadius:15,padding:13},moduleIcon:{fontSize:22,color:GOLD,marginBottom:8},moduleTitle:{fontSize:14,color:'#F4EBDD',fontWeight:'700'},moduleSub:{fontSize:10,color:MUTED,lineHeight:15,marginTop:5},input:{backgroundColor:'#171715',borderColor:'#39352B',borderWidth:1,borderRadius:12,padding:14,color:'#F4EBDD',marginBottom:14},pill:{alignSelf:'flex-start',color:GOLD,borderWidth:1,borderColor:'#68552D',overflow:'hidden',borderRadius:20,paddingHorizontal:10,paddingVertical:5,fontSize:9,letterSpacing:1,marginTop:10},price:{fontSize:21,color:GOLD,fontWeight:'800'},action:{color:GOLD,marginTop:14,fontSize:13,fontWeight:'700'},nav:{height:66,backgroundColor:'#141412',borderTopWidth:1,borderTopColor:'#302D25',flexDirection:'row',justifyContent:'space-around',alignItems:'center'},navItem:{alignItems:'center',justifyContent:'center',minWidth:54},navText:{color:'#918B80',fontSize:11,fontWeight:'600'},navActive:{color:'#F2D38B'},navDot:{width:4,height:4,borderRadius:2,backgroundColor:'transparent',marginTop:5}
});