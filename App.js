import * as React from 'react';
import { Button, FlatList, ImageBackground, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import dictionaryFile from './dictionary.json';
import textFile from './text.json';
import red from './red.png';

const numberOfButtons = 2;

const WORDLIST = []

var highscore = 0;
var winstreak = 0;
var baseLanguage = new Array();
var targetLanguage = new Array();
var textContent = textFile.hungarian;

function QuizScreen({ navigation }) {

	/* these are always indexes of english phrases - odd numbers */
	var wrongWord = 2 * Math.floor(Math.random() * (dictionaryFile.length / 2 + 1)); 
	var correctWord = 2 * Math.floor(Math.random() * (dictionaryFile.length / 2 + 1));
	var correctButton = Math.floor(Math.random() * numberOfButtons);
	var prompt = "";
	var firstButton = "";
	var secondButton = "";

	/* + 1 to reach the hungarian equivalent - even numbers */
	if (correctButton == 0) {
		firstButton = dictionaryFile[correctWord + 1];
		secondButton = dictionaryFile[wrongWord + 1];
	} else {
		firstButton = dictionaryFile[wrongWord + 1];
		secondButton = dictionaryFile[correctWord + 1];
	};
	prompt = dictionaryFile[correctWord];
	WORDLIST.push({title: dictionaryFile[correctWord]});
	WORDLIST.push({title: dictionaryFile[correctWord+1]});

	return (
		<View style={styles.quizContainer}>

			<View>
				<Text style={styles.feedbackText}> {prompt} </Text>
			</View>

			<View style={styles.quizButtonContainer}>
				<View style={styles.quizButton}>
					<Button
						title = {firstButton}
						onPress = {() => {
							if (correctButton == 0) {
								winstreak++;
								navigation.push('Quiz');
							} else {
								navigation.navigate('Feedback',{correct: correctWord});
							};
						}}
					/>
				</View>
				<View style={styles.quizButton}>
					<Button
						title = {secondButton}
						onPress = {() => {
							if (correctButton == 1) {
								winstreak++;
								navigation.push('Quiz');
							} else {
								navigation.navigate('Feedback',{correct: correctWord});
							};
						}}
					/>
				</View>
			</View>
		</View>
	);
}

function FeedbackScreen({ route, navigation }) {
	return (
		<View style={styles.feedbackContainer}>
			<ImageBackground
				source={red}
				resizeMode="stretch"
				style={{flex:1, justifyContent: "center"}}>
					<View style={styles.feedbackTextContainer}>
						<View>
							<Text style={styles.feedbackText}>
								{dictionaryFile[route.params.correct]}
							</Text>
							<Text style={styles.feedbackText2}>
								{dictionaryFile[route.params.correct +1]}
							</Text>
						</View>
					</View>
					<View style={styles.feedbackButtonContainer}>
						<Button
							title = "OK"
							onPress = {() => {
								if (winstreak > highscore) highscore = winstreak;
								navigation.navigate('Summary');
							}}
						/>
					</View>
				</ImageBackground>
		</View>
	);
}

function SummaryScreen({ navigation }) {
	return (
		<View style={styles.summaryContainer}>

				<View style={styles.summaryTextContainer}>
					<Text style={styles.streakText}>
						{textContent.streak}
					</Text>
					<Text style={styles.winstreakText}>
						{winstreak}
					</Text>
					<Text style={styles.highscoreText}>
						{textContent.record} {highscore}
					</Text>
				</View>

				<View style={styles.summaryButtonContainer}>
					<View style={styles.summaryButton}>
						<Button
							title = "Szó Lista"
							onPress = {() => {
								winstreak = 0;
								navigation.navigate('List');
							}}
						/>
					</View>
					<View style={styles.summaryButton}>
						<Button
							title = "Új játék"
							onPress = {() => {
								winstreak = 0;
								navigation.navigate('Quiz');
							}}
						/>
					</View>

				</View>

		</View>
	);
}

const Item = ({ title }) => (
  <View style={styles.listItem}>
    <Text style={styles.listTitle}>{title}</Text>
  </View>
);
function ListScreen({ navigation }) {
	const renderItem = ({ item }) => (
		<Item title={item.title} />
	);  

	return (
		<View style={styles.listContainer}>
			<FlatList
				numColumns = {2}
				key = {2}
				data = {WORDLIST}
				renderItem = {renderItem}
			/>
		</View>
	);
}

const Stack = createNativeStackNavigator();
function App() {
	return (
		<NavigationContainer initialRouteName="Quiz">
			<Stack.Navigator>
				<Stack.Screen
					name = "Quiz"
					component = {QuizScreen}
					options = {{ title: "Válassza ki a jó fordítást!" }}
				/>
				<Stack.Screen
					name = "Feedback"
					component = {FeedbackScreen}
					options = {{ title: "Rossz válasz" }}
				/>
				<Stack.Screen
					name = "Summary"
					component = {SummaryScreen}
					options = {{ title: "Játék Vége" }}
				/>
				<Stack.Screen
					name = "List"
					component = {ListScreen}
					options = {{ title: "Szó Lista" }}
				/>
			</Stack.Navigator>
		</NavigationContainer>
	);
}

const styles = StyleSheet.create({
	languageSelectContainer: {
		flex: 0.5,
		padding: 20,
		marginRight: 150,
		marginLeft: 10,
		justifyContent: 'space-between'
	},
	languageSelectTitleLeft: {
		fontSize:30,
		padding: 10,
		color: 'black'
	},
	languageSelectContainerRight: {
		flex: 0.5,
		padding: 20,
		marginLeft: 150,
		marginRight: 10,
		justifyContent: 'space-between'
	},
	languageSelectTitleRight: {
		fontSize:30,
		padding: 10,
		color: 'black',
		textAlign : 'right'
	},
	quizButton: {
/*		width: '33%',
		height: 40,
*/		margin: 20
	},
	quizButtonContainer: {
/*		flex: 1,
		flexDirection: 'row',
*/		justifyContent: 'space-between',
	},
	feedbackText: {
		fontSize: 32,
		padding: 20,
		textAlign: 'center' ,
		color: 'black',
		fontStyle : "italic"
	},
	feedbackText2: {
		fontSize: 32,
		padding:20,
		textAlign: 'center',
		color: 'black'
	},
	quizContainer: {
		marginTop: 10,
	},
	feedbackTextContainer: {
		flex: 0.7
	},
	feedbackButtonContainer: {
		flex: 0.2,
		marginLeft: 260,
		marginRight: 30,
	},
	feedbackContainer: {
		flex: 1,
	},
	streakText: {
		fontSize: 40,
		color: 'black',
		textAlign: 'center'
	},
	winstreakText: {
		fontSize: 70,
		padding: 10,
		color: 'black',
		textAlign: 'center'
	},
	highscoreText: {
		fontSize: 30,
		padding: 10,
		color: 'black',
		textAlign: 'center'
	},
	summaryButtonContainer: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between'
	},
	summaryButton: {
		margin: 20,
		width: '40%',
		height: 40
	},
	summaryContainer: {
		flex:1,
		marginTop: 40
	},
	summaryTextContainer: {
		flex:2
	},
	listTitle: {
		fontSize: 20,
		color: '#FFFFFF',
	},
	listItem: {
		flex: 1,
		backgroundColor: '#0066CC',
		padding: 8,
		marginVertical: 8,
		marginHorizontal: 8,
		flexShrink: 1 ,
	},
	listContainer: {
		flex: 1,
	},
});

export default App;