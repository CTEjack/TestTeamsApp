import * as React from "react";
import { Provider, Flex, Text, Header, Card, CardHeader, Avatar, CardBody, Loader, Divider, Grid, Segment } from "@fluentui/react-northstar";
import TeamsBaseComponent, { ITeamsBaseComponentState } from "msteams-react-base-component";
import * as microsoftTeams from "@microsoft/teams-js";
import "../styles/styles.css";
import { VictoryChart, VictoryScatter, VictoryTheme, VictoryPie, VictoryAnimation, VictoryLabel, VictoryAxis, VictoryLine } from "victory";
import { IChatTabState } from "../chatTab/ChatTab";


export interface IDigitalWorkPackageState extends ITeamsBaseComponentState {
    // history: IChatTabState[]
    entityId?: string;
    loading: boolean;
    machineId: GUID;
    time: Date;
    voltage: number;
    temperature: number;
    light: number;
    intervalId?
}

type GUID = string & { isGuid: true};
function guid(guid: string) : GUID {
    return  guid as GUID; // maybe add validation that the parameter is an actual guid ?
}


/**
 * Properties for the NewTabTab React component
 */
export interface IDigitalWorkPackageProps {

}

/**
 * Implementation of the New content page
 */
export class DigitalWorkPackage extends TeamsBaseComponent<IDigitalWorkPackageProps, IDigitalWorkPackageState> {


    public async componentWillMount() {
        this.updateTheme(this.getQueryVariable("theme"));


        if (await this.inTeams()) {
            microsoftTeams.initialize();
            microsoftTeams.registerOnThemeChangeHandler(this.updateTheme);
            microsoftTeams.getContext((context) => {
                microsoftTeams.appInitialization.notifySuccess();
                this.setState({
                    entityId: "test"
                });
                this.updateTheme(context.theme);
            });
        } else {
            this.setState({
                entityId: "This is not hosted in Microsoft Teams"
            });
        }

    }

    // public async componentDidMount() {
    //     const url = "https://contexterebotapp.azurewebsites.net/api/sensordata/historical";
    //     const proxy = "https://cors-anywhere.herokuapp.com/";
    //     const response = await fetch(proxy + url);
    //     const data = await response.json();
    //     this.setState({history:data});
    // }



    public async componentDidMount() {
        const intervalId = setInterval(() => this.loadData(), 3000);
        this.loadData(); // Load one immediately
    }

    public async componentWillUnmount() {
        clearInterval();
    }

    public async loadData() {
        const url = "https://contexterebotapp.azurewebsites.net/api/sensordata/";
        const proxy = "https://cors-anywhere.herokuapp.com/";
        const response = await fetch(proxy + url);
        const data = await response.json();
        this.setState({
            machineId: data.machineId,
            time: data.time, // Timestamp format: ISO 8601
            voltage: data.voltage,
            temperature: data.temperature,
            light: data.light,
            loading: false,
        });
    }

    public render() {
        const humanTime = new Date(this.state.time);
        const TempHistory =
            [
                { x: "10:00am", y: 87 },
                { x: "10:07am", y: 23 },
                { x: "10:14am", y: 77 },
                { x: "10:21am", y: 51 },
                { x: "10:28am", y: 17 },
                { x: "10:35am", y: 98 },
                { x: "10:42am", y: 34 },
                { x: "10:49am", y: 72 },
                { x: "10:56am", y: 43 },
                { x: "11:03am", y: 60 },
                { x: "11:10am", y: 67 },
            ]

        return (
        <Provider 
            theme={this.state.theme}>
            {/* https://fluentsite.z22.web.core.windows.net/layout */}
            
            
            {/*START First Row */}
            <Flex 
                fill={true}  
                gap="gap.small"
                styles={{
                    padding: ".8rem 0 .8rem .5rem"}}>
                
                {/*::: Current Temperature Card :::*/}
                <Flex.Item>
                    <Card>
                        <CardHeader>
                            <Flex gap="gap.small">
                                <Flex column>
                                    <Text size="medium" weight="bold" content="Current internal temperature" /> 
                                    <br/>
                                    {this.state.loading || !this.state.time ? 
                                        <Text disabled size="small" content="Fetching timestamp..." />
                                        : 
                                        <Text timestamp content={humanTime.toLocaleTimeString()} />
                                    }
                                    <Divider />
                                </Flex>
                            </Flex>
                        </CardHeader>
                        <CardBody>
                            {this.state.loading || !this.state.temperature ? 
                                    <Loader label="Fetching temperature data..."/> 
                                    : 
                                    <div> 
                                        <VictoryChart
                                            width={400}
                                            height={400}
                                            animate={{
                                                duration: 500,
                                                onLoad: {duration: 500}
                                            }}>
                                            <VictoryAxis style={{axis: {stroke: "none"} }} />
                                            <VictoryPie
                                                data={[
                                                    {x: " ", y: this.state.temperature },
                                                    {x: " ", y: (Math.floor(100 - this.state.temperature))}
                                                ]} 
                                                colorScale={["tomato", "white"]}
                                                innerRadius={100} labelRadius={200}
                                                cornerRadius={({ datum }) => datum.y = 5}
                                            />
                                            <VictoryLabel
                                                textAnchor="middle" 
                                                verticalAnchor="middle"
                                                x={200} y={200} 
                                                text={this.state.temperature + "\u00B0"+"C"}
                                                style={{ fontSize: 55 }}/>
                                        </VictoryChart>
                                    </div>
                                }
                        </CardBody>
                    </Card>
                </Flex.Item> {/*::: END Current Temperature Card :::*/}

                {/*::: Historic Temperature Card :::*/}
                <Flex.Item>
                    <Card fluid>
                        <CardHeader>
                            <Flex gap="gap.small">
                                <Flex column>
                                    <Text size="medium" weight="bold" content="Temperature log" /> 
                                    <br/>
                                    {this.state.loading || !this.state.time ? 
                                        <Text disabled size="small" content="Fetching timestamp..." />
                                        : 
                                        <Text timestamp content={humanTime.toLocaleTimeString()} />
                                    }
                                    <Divider />
                                </Flex>
                            </Flex>
                        </CardHeader>
                        <CardBody>
                            {this.state.loading || !this.state.time ? 
                                <Loader label="Fetching temperature history..."/> 
                                : 
                                <div> 
                                    <VictoryChart
                                        height={100}
                                        width={400}
                                        padding={{ top: 10, bottom: 20, left: 20, right: 10 }}
                                        theme={VictoryTheme.material}
                                        animate={{
                                            duration: 500,
                                            onLoad: {duration: 500}
                                        }}>
                                        <VictoryAxis 
                                            style={{
                                                tickLabels: { fontSize: 5 } 
                                        }} />
                                        <VictoryAxis dependentAxis
                                            domain={[0, 100]}
                                            style={{
                                                tickLabels: { fontSize: 5 } 
                                        }} />
                                        <VictoryLine
                                            data={TempHistory}
                                            style={{ data: { stroke: "#c43a31" } }}
                                        />
                                        <VictoryScatter
                                            data={TempHistory}
                                            style={{ data: { fill: "#c43a31" } }}
                                        />
                                    </VictoryChart>
                                </div>
                            }
                        </CardBody>
                    </Card>
                </Flex.Item> {/*::: END Historic Temperature Card :::*/}
            </Flex> {/*END First Row */}
            
            {/*START Second Row */}
            <Flex 
                fill={true}  
                gap="gap.small"
                styles={{
                    padding: ".8rem 0 .8rem .5rem"}}>

            </Flex>
        </Provider>
        );
    }// end render

}