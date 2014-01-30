# iotkit-agent

> Note, the agent will be undergoing some modification in preparation for upcoming event. The tag [`0.7.0`](https://github.com/enableiot/iotkit-agent/commit/af2de259530d04585fdf49f8aef471fee3899c93) is the last stable version.

Edge agent to abstract cloud connectivity complexities. It allows edge developers to focus on writing their experiments and interacting with I/O parameters. When sending data to the cloud, the message formatting and security is implemented in the agent so only the message payload has to be provided.   

![Agent Topology](../master/images/agent-topo.png?raw=true)

## Deployment

> This portion of the read me is only required for the initial deployment of the `iotkit-agent`. In many the SD card provided with your board will already come configured with this agent, in which case you can move on to the Usage portion of this read me.

### Installation

Installation

Clone the iotkit-agent project
    
    git clone https://github.com/enableiot/iotkit-agent.git
    cd iotkit-agent

In the iotkit-agent directory run:

    ./setup-agent.sh
    
### Configuration

The `iotkit-agent`, by default, has sufficient defaults to register itself in the Cloud. To send data to the Cloud however, the `iotkit-agent` requires modification of two arguments: Username and Password. To define these values, simple rename the sample configuration file included with the agent:

    cp ./config-sample.json ./config.json

And change the default `username` and `password` values:

    {
      username: 'newdevice',
      password: 'iotkit'
    }
    
> You can also change other values in the sample config, but, unless you are sure you know what they mean, these are best left unchanged.
        
### Start

To start the agent service simply execute the `start-agent.sh` file:

    ./start-agent.sh
    
### Stop

    ./stop-agent.sh

## Usage

For instructions how to use the `iotkit-agent` please the [iotkit-samples repo](https://github.com/enableiot/iotkit-samples).

## License

Copyright (c) 2013, enableiot.com
All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice, this
  list of conditions and the following disclaimer in the documentation and/or
  other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
