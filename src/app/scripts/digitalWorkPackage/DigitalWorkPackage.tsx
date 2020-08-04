import * as React from "react";
import { Provider, Flex, Text, Header, Card, CardHeader, Avatar, CardBody, Loader, Divider, Grid, Segment } from "@fluentui/react-northstar";
import TeamsBaseComponent, { ITeamsBaseComponentState } from "msteams-react-base-component";
import * as microsoftTeams from "@microsoft/teams-js";
import "../styles/styles.css";
import { VictoryChart, VictoryScatter, VictoryTheme, VictoryPie, VictoryAnimation, VictoryLabel, VictoryAxis, VictoryLine, VictoryBar } from "victory";
import { IChatTabState } from "../chatTab/ChatTab";


export class SensorRecord {
  machineId: string;
  time: string;
  voltage: number;
  temperature: number;
  light: number;
}

type GUID = string & { isGuid: true};
function guid(guid: string) : GUID {
    return  guid as GUID; // maybe add validation that the parameter is an actual guid ?
}

export interface SensorRecordsProps {

}
/**
 * Properties for the NewTabTab React component
 */
export interface SensorRecords extends ITeamsBaseComponentState  {
    entityId: string;
    loading: boolean;
    records:SensorRecord[];
}

/**
 * Implementation of the New content page
 */
export class DigitalWorkPackage extends TeamsBaseComponent<SensorRecordsProps, SensorRecords> {


    public async componentWillMount() {
        this.updateTheme(this.getQueryVariable("theme"));


        if (await this.inTeams()) {
            microsoftTeams.initialize();
            microsoftTeams.registerOnThemeChangeHandler(this.updateTheme);
            microsoftTeams.getContext((context) => {
                microsoftTeams.appInitialization.notifySuccess();
                this.setState({
                    entityId: "test",
                    loading:true
                });
                this.updateTheme(context.theme);
            });
        } else {
            this.setState({
                entityId: "This is not hosted in Microsoft Teams",
                loading:true
            });
        }

    }


    public async componentDidMount() {
        const url = "https://contexterebotapp.azurewebsites.net/api/sensordata/historical";
        const proxy = "https://cors-anywhere.herokuapp.com/";
        const response = await fetch(proxy + url);
        const data =  await response.json()
        try {
            this.setState({records: data, loading: false})
        }
        catch(e) {
            console.log(e, data)
        }

       
    }

    public async componentWillUnmount() {
        clearInterval();
    }

    public render() {

        return (
        <Provider 
            theme={this.state.theme}>
            {/* https://fluentsite.z22.web.core.windows.net/layout */}

            <Grid
                // Set row sizes to viewport width - will this break when sideloaded into MS Teams?
                styles={{
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gridTemplateRows: '30vw 30vw',
                    msGridColumns: '(1fr)[4]',
                    msGridRows: '30vw 30vw',
                    gridColumnGap: '10px',
                    gridRowGap: '10px'
                }}>
                
                {/* START Current Voltage Card */}
                <Card 
                    fluid
                    styles={{
                        gridColumn: 'span 3',
                    }}>
                    <CardHeader>
                        <Flex gap="gap.small">
                            <Flex column>
                                <Text size="medium" weight="bold" content="Current voltage" /> 
                                <br/>
                                {this.state.loading || !this.state.records ? 
                                    <Text disabled size="small" content="Fetching timestamp..." />
                                    : 
                                    <Text timestamp content={this.state.records[0].time} />
                                }
                                <Divider />
                            </Flex>
                        </Flex>
                    </CardHeader>
                    <CardBody>
                        {this.state.loading || !this.state.records ? 
                            <Loader label="Fetching current voltage..."/> 
                            : 
                            <div> 
                                <VictoryChart
                                    horizontal
                                    domainPadding={{x: 60}}
                                    padding={{ top: 10, bottom: 25, left: 25, right: 15 }}
                                    width={300}
                                    height={100}
                                    theme={VictoryTheme.material}
                                >
                                    <VictoryBar
                                        style={{data: {fill: "tomato", width: 60}}}
                                        data={[
                                            {sensor: " ", value: this.state.records[0].voltage},
                                        ]}
                                        x="sensor"
                                        y="value"
                                        animate={{
                                            duration: 500,
                                            onLoad: {duration: 500}
                                            }}                                            
                                    />
                                    <VictoryAxis />
                                    <VictoryAxis dependentAxis
                                        domain={[0, 220]}
                                        style={{
                                            tickLabels: { fontSize: 5 } 
                                        }}
                                    />
                                </VictoryChart>
                            </div>
                        }
                    </CardBody>
                </Card>{/* END Current Voltage Card */}
                
                {/*::: START Current Temperature Card :::*/}
                <Card 
                    fluid
                    styles={{
                        gridColumn: 'span 1',
                    }}>
                    <CardHeader>
                        <Flex gap="gap.small">
                            <Flex column>
                                <Text size="medium" weight="bold" content="Current temperature" /> 
                                <br/>
                                {this.state.loading || !this.state.records ? 
                                    <Text disabled size="small" content="Fetching timestamp..." />
                                    : 
                                    <Text timestamp content={this.state.records[0].time} />
                                }
                                <Divider />
                            </Flex>
                        </Flex>
                    </CardHeader>
                    <CardBody>
                        {this.state.loading  || !this.state.records ? 
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
                                                {x: " ", y: this.state.records[0].temperature },
                                                {x: " ", y: 100 - this.state.records[0].temperature}
                                            ]} 
                                            colorScale={["tomato", "white"]}
                                            innerRadius={100} labelRadius={200}
                                            cornerRadius={({ datum }) => datum.y = 5}
                                        />
                                        <VictoryLabel
                                            textAnchor="middle" 
                                            verticalAnchor="middle"
                                            x={200} y={200} 
                                            text={this.state.records[0].temperature + "°C" }
                                            style={{ fontSize: 55 }}/>
                                    </VictoryChart>
                            -    </div>
                            }
                    </CardBody>
                </Card>{/*::: END Current Temperature Card :::*/}

                {/*::: START Historic Temperature Card :::*/}
                <Card 
                    fluid
                    styles={{
                        gridColumn: 'span 4',
                    }}>
                    <CardHeader>
                        <Flex gap="gap.small">
                            <Flex column>
                                <Text size="medium" weight="bold" content="Temperature log" /> 
                                <br/>
                                {this.state.loading || !this.state.records ? 
                                    <Text disabled size="small" content="Fetching timestamp..." />
                                    : 
                                    <Text timestamp content={this.state.records[0].time} />
                                }
                                <Divider />
                            </Flex>
                        </Flex>
                    </CardHeader>
                    <CardBody>
                        {this.state.loading || !this.state.records ? 
                            <Loader label="Fetching temperature history..."/> 
                            : 
                            <div> 
                                <VictoryChart
                                    height={100}
                                    width={400}
                                    padding={{ top: 15, bottom: 20, left: 20, right: 10 }}
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
                                        data={this.state.records.slice(0,8).map(t => t.temperature)}
                                        style={{ data: { stroke: "tomato" } }}
                                    />
                                    <VictoryScatter
                                        data={this.state.records.slice(0,8).map(t => t.temperature)}
                                        labels={({ datum }) => datum.y}
                                        style={{ 
                                            data: { fill: "tomato" },
                                            labels: { fontSize: 5, fill: "tomato" } 
                                        }}
                                    />
                                </VictoryChart>
                            </div>
                        }
                    </CardBody>
                </Card>{/*::: END Historic Temperature Card :::*/}
            </Grid>
        </Provider>
        );
    }// end render

}