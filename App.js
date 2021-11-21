import * as React from 'react';
import { Button, ImageBackground, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import dictionaryFile from './dictionary.json';
import textFile from './text.json';
import flags from './langSelect.png';
import red from './red.png';

const numberOfButtons = 2;
var highscore = 0;
var winstreak = 0;
var baseLanguage = new Array();
var targetLanguage = new Array();
var textContent = textFile.hungarian;
baseLanguage = dictionaryFile.hungarian;
targetLanguage = dictionaryFile.english;

function BaseSelectScreen({ navigation }) {
	return (
		<View style={styles.languageSelectContainer}>
			<Text style={styles.languageSelectTitleLeft}>
				{textContent.languageA}
			</Text>
			<Button
				title = "English"
				onPress = {() => {
					baseLanguage = dictionaryFile.english;
					textContent = textFile.english;
					navigation.navigate('TargetSelect');
				}}
			/>
			<Button
				title = "Magyar"
				onPress = {() => {
					baseLanguage = dictionaryFile.hungarian;
					textContent = textFile.hungarian;
					navigation.navigate('TargetSelect');
				}}
			/>
			<Button
				title = "Suomeksi"
				onPress = {() => {
					baseLanguage = dictionaryFile.finnish;	
					textContent = textFile.finnish;
					navigation.navigate('TargetSelect');
				}}
			/>
		</View>
	);
}

function TargetSelectScreen({ navigation }) {
	return (
		<View style={styles.languageSelectContainerRight}>
			<Text style={styles.languageSelectTitleRight}>
				{textContent.languageB}
			</Text>
			<Button
				title = {textContent.english}
				onPress = {() => {
					targetLanguage = dictionaryFile.english;
					navigation.navigate('Quiz');
				}}
			/>
			<Button
				title = {textContent.hungarian}
				onPress = {() => {
					targetLanguage = dictionaryFile.hungarian;
					navigation.navigate('Quiz');
				}}
			/>
			<Button
				title = {textContent.finnish}
				onPress = {() => {
					targetLanguage = dictionaryFile.finnish;	
					navigation.navigate('Quiz');
				}}
			/>
		</View>
	);
}

function QuizScreen({ navigation }) {
	var wrongWord = Math.floor(Math.random() * baseLanguage.length);
	var correctWord = Math.floor(Math.random() * baseLanguage.length);
	var correctButton = Math.floor(Math.random() * numberOfButtons);
	var firstButton = "";
	var secondButton = "";

	if (correctButton == 0) {
		firstButton = baseLanguage[correctWord];
		secondButton = baseLanguage[wrongWord];
	} else {
		firstButton = baseLanguage[wrongWord];
		secondButton = baseLanguage[correctWord];
	};

	return (
		<View style={styles.quizContainer}>
			<View>
				<Text style={styles.feedbackText}> {targetLanguage[correctWord]} </Text>
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
								{targetLanguage[route.params.correct]}
							</Text>
							<Text style={styles.feedbackText2}>
								{baseLanguage[route.params.correct]}
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
			<ImageBackground
				source={flags}
				resizeMode="cover"
				style={{flex:1, justifyContent: "center"}}>
					<View style={styles.summaryTextContainer}>
						<Text style={styles.streakText}>{textContent.streak}</Text>
						<Text style={styles.winstreakText}> {winstreak} </Text>
						<Text style={styles.highscoreText}> {textContent.record} {highscore} </Text>
					</View>
					<View style={styles.summaryButtonContainer}>
						<View style={styles.summaryButton}>
							<Button
								title = {textContent.languageSelect}
								onPress = {() => {
									winstreak = 0;
									navigation.navigate('BaseSelect');
								}}
							/>
						</View>
						<View style={styles.summaryButton}>
							<Button
								title = "OK"
								onPress = {() => {
									winstreak = 0;
									navigation.navigate('Quiz');
								}}
							/>
						</View>
					</View>
			</ImageBackground>
		</View>
	);
}

const Stack = createNativeStackNavigator();

function App() {
	return (
	<NavigationContainer initialRouteName="BaseSelect">
		<Stack.Navigator>
			<Stack.Screen
				name = "BaseSelect"
				component = {BaseSelectScreen}
				options = {{ title: "" }}
			/>
			<Stack.Screen
				name = "TargetSelect"
				component = {TargetSelectScreen}
				options = {{ title: "" }}
			/>
			<Stack.Screen
				name = "Quiz"
				component = {QuizScreen}
				options = {{ title: "" }}
			/>
			<Stack.Screen
				name = "Feedback"
				component = {FeedbackScreen}
				options = {{ title: "" }}
			/>
			<Stack.Screen
				name = "Summary"
				component = {SummaryScreen}
				options = {{ title: "" }}
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
		width: '33%',
		height: 40,
		margin: 30
	},
	quizButtonContainer: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	feedbackText: {
		fontSize: 50,
		padding: 20,
		textAlign: 'center'
	},
	feedbackText2: {
		fontSize: 50,
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
});

export default App;