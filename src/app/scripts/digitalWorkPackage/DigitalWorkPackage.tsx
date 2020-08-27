import * as React from "react";
import { Provider, Flex, Text, Header, Card, CardHeader, Avatar, CardBody, Loader, Divider, Grid, Segment, FlexItem } from "@fluentui/react-northstar";
import TeamsBaseComponent, { ITeamsBaseComponentState } from "msteams-react-base-component";
import * as microsoftTeams from "@microsoft/teams-js";
import "../styles/styles.css";
import { VictoryChart, VictoryScatter, VictoryTheme, VictoryPie, VictoryAnimation, VictoryLabel, VictoryAxis, VictoryLine, VictoryBar } from "victory";
// import { useMediaQuery } from 'react-responsive';
import MediaQuery from "react-responsive";
import { IChatTabState } from "../chatTab/ChatTab";


export class SensorRecord {
  machineId: string;
  time: Date;
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
    records: SensorRecord[];
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
        const intervalId = setInterval(() => this.loadData(), 10000);
        this.loadData(); // Load one immediately
    }

    public async componentWillUnmount() {
        clearInterval();
    }

    public async loadData() {
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

    /* 
       https://docs.microsoft.com/en-us/windows/uwp/design/layout/screen-sizes-and-breakpoints-for-responsive-design
       UWP Breakpoints:
       -- large: 1008px and larger
       -- medium: 641px to 1007px
       -- small: smaller than 640px 
    */ 
    
    public render() {
        // const timestamp = this.state.records[0].time;
        // console.log(new Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'}).format(this.state.records[0].time));

        return (
        <Provider 
            theme={this.state.theme}>
            {/* https://fluentsite.z22.web.core.windows.net/layout */}

            {/*::: START small breakpoint :::*/} 
            <MediaQuery minWidth={0} maxWidth={639}>
                <Text>Appears when smaller that 640px</Text>
                <Flex 
                    fill={true} 
                    column 
                    gap="gap.small"
                    styles={{
                        padding: ".8rem 0 .2rem .5rem"}}>
                    
                    {/*::: START current voltage card - small viewport :::*/} 
                    <Flex.Item>
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
                                        <Text size="larger" weight="semibold" style={{color: "tomato"}} content={this.state.records[0].voltage + " volts"} />
                                        <br />
                                        <VictoryChart
                                            horizontal
                                            padding={{ top: 10, bottom: 25, left: 0, right: 15 }}
                                            height={25}
                                            theme={VictoryTheme.material}
                                        >
                                            <VictoryBar
                                                style={{data: {fill: "tomato"}}}
                                                data={[
                                                    {sensor: " ", value: this.state.records[0].voltage},
                                                ]}
                                                x="sensor"
                                                y="value"
                                                barWidth={2}
                                                animate={{
                                                    duration: 500,
                                                    onLoad: {duration: 500}
                                                    }}                                            
                                            />
                                            <VictoryAxis 
                                                dependentAxis
                                                domain={[0, 220]}
                                                tickCount={12}
                                                style={{
                                                    tickLabels: { fontSize: 8 },
                                                    ticks: {opacity: 0.25},
                                                    axisLabel: {display: "none"},
                                                    axis: {display: "none"}
                                                }}
                                            />
                                        </VictoryChart>
                                    </div>
                                    }
                            </CardBody>
                        </Card>
                    </Flex.Item>
                    {/*::: END current voltage card - small viewport :::*/} 

                    {/*::: START current temperature card - small viewport :::*/} 
                    <Flex.Item>
                        <Card 
                            fluid
                            styles={{
                                gridColumn: 'span 3',
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
                                {this.state.loading || !this.state.records ? 
                                    <Loader label="Fetching current temperature..."/> 
                                    : 
                                    <div>
                                        <Text size="larger" weight="semibold" style={{color: "tomato"}} content={this.state.records[0].temperature  + "°C"} />
                                        <br />
                                        <VictoryChart
                                            horizontal
                                            padding={{ top: 10, bottom: 25, left: 0, right: 15 }}
                                            height={25}
                                            theme={VictoryTheme.material}
                                        >
                                            <VictoryBar
                                                data={[
                                                    {sensor: " ", value: this.state.records[0].temperature},
                                                ]}
                                                x="sensor"
                                                y="value"
                                                // labels={this.state.records.slice(0,1).map(t => t.temperature + "°C")}
                                                // labelComponent={<VictoryLabel dy={-6} dx={-8}  />}
                                                barWidth={2}
                                                animate={{
                                                    duration: 500,
                                                    onLoad: {duration: 500}
                                                }}
                                                style={{
                                                    data: {fill: "tomato"},
                                                    // labels: { fontSize: 10, fill: "tomato" }
                                                }}
                                            />
                                            <VictoryAxis 
                                                dependentAxis
                                                domain={[0, 100]}
                                                tickCount={10}
                                                style={{
                                                    tickLabels: { fontSize: 8 },
                                                    ticks: {opacity: 0.25},
                                                    axisLabel: {display: "none"},
                                                    axis: {display: "none" }
                                                }}
                                            />
                                        </VictoryChart>
                                    </div>
                                    }
                            </CardBody>
                        </Card>
                    </Flex.Item>
                    {/*::: END current temperature card - small viewport :::*/}


                </Flex>
            </MediaQuery>

            {/*::: START medium breakpoint :::*/}                      
            <MediaQuery minWidth={640} maxWidth={1007}>
                <Text>Appears between 640px and 1007px</Text>
            </MediaQuery>

            {/*::: START large breakpoint :::*/}
            <MediaQuery minWidth={1008}>
                <Text>Appears when larger than 1224px</Text>
                <Grid
                    styles={{
                        gridTemplateColumns: 'repeat(4, 1fr)',
                        gridTemplateRows: '30vw 30vw',
                        msGridColumns: '(1fr)[4]',
                        msGridRows: '30vw 30vw',
                        gridColumnGap: '10px',
                        gridRowGap: '10px'
                    }}>
                    
                    {/* START Current Voltage Card - large viewport */}
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
                    </Card>{/* END Current Voltage Card - large viewport */}
                    
                    {/*::: START Current Temperature Card - large viewport :::*/}
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
                                            width={300}
                                            height={300}
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
                                                innerRadius={50} labelRadius={100}
                                                cornerRadius={({ datum }) => datum.y = 5}
                                            />
                                            <VictoryLabel
                                                textAnchor="middle" 
                                                verticalAnchor="middle"
                                                x={150} y={150} 
                                                text={this.state.records[0].temperature + "°C" }
                                                style={{ fontSize: 25 }}/>
                                        </VictoryChart>
                                    </div>
                                }
                        </CardBody>
                    </Card>{/*::: END Current Temperature Card - large viewport :::*/}

                    {/*::: START Historic Temperature Card - large viewport :::*/}
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
                                                tickLabels: { fontSize: 0},
                                                ticks: {stroke: "none"}

                                        }} />
                                        <VictoryAxis dependentAxis
                                            domain={[0, 100]}
                                            tickCount={10 }
                                            style={{
                                                tickLabels: { fontSize: 5 } 
                                        }} />
                                        <VictoryLine
                                            data={this.state.records.slice(0,8).map(t => t.temperature)}
                                            style={{ data: { stroke: "tomato" } }}
                                        />
                                        <VictoryScatter
                                            data={this.state.records.slice(0,8).map(t => t.temperature)}
                                            labels={this.state.records.slice(0,8).map(t => t.temperature + "°C")}
                                            style={{ 
                                                data: { fill: "tomato" },
                                                labels: { fontSize: 5, fill: "tomato" } 
                                            }}
                                        />
                                    </VictoryChart>
                                </div>
                            }
                        </CardBody>
                    </Card>{/*::: END Historic Temperature Card - large viewport :::*/}
                </Grid>
            </MediaQuery>{/*::: END Large breakpoint - +1008px :::*/}

        </Provider>
        );
    }// end render

}