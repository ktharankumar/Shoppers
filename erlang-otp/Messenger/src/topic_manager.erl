%%%-------------------------------------------------------------------
%%% @author ktharnkumar
%%% @copyright (C) 2026, <COMPANY>
%%% @doc
%%%
%%% @end
%%% Created : 09. Jan 2026 19:13
%%%-------------------------------------------------------------------
-module(topic_manager).
-author("ktharnkumar").

-behaviour(gen_server).

%% API
-export([start_link/0, ensure_topic/1, subscribe/2, publish/2, topic_pid/1, request/4, reply/3, unsubscribe/2]).
%% gen_server callbacks
-export([init/1, handle_call/3, handle_cast/2, handle_info/2, terminate/2, code_change/3]).

-record(state, {
  topics = #{}  %% Topic => Pid
}).

start_link() ->
  gen_server:start_link({local, ?MODULE}, ?MODULE, [], []).

%% Create topic if missing, return Pid
ensure_topic(Topic) ->
  gen_server:call(?MODULE, {ensure_topic, Topic}).

topic_pid(Topic) ->
  gen_server:call(?MODULE, {topic_pid, Topic}).

subscribe(Topic, SubscriberPid) ->
  Pid = ensure_topic(Topic),
  topic_worker:subscribe(Pid, SubscriberPid).

publish(Topic, Payload) ->
  Pid = ensure_topic(Topic),
  topic_worker:publish(Pid, Payload).

init([]) ->
  {ok, #state{}}.

handle_call({ensure_topic, Topic}, _From, State=#state{topics = Topics}) ->
  case maps:get(Topic, Topics, undefined) of
    undefined ->
      {ok, Pid} = topic_worker:start_link(Topic),
      %% monitor topic worker so we can clean map if it dies
      erlang:monitor(process, Pid),
      {reply, Pid, State#state{topics = Topics#{Topic => Pid}}};
    Pid ->
      {reply, Pid, State}
  end;

handle_call({topic_pid, Topic}, _From, State=#state{topics = Topics}) ->
  case maps:get(Topic, Topics, undefined) of
    undefined -> {reply, {error, topic_not_found}, State};
    Pid -> {reply, {ok, Pid}, State}
  end;

handle_call(_Req, _From, State) ->
  {reply, {error, bad_request}, State}.

handle_cast(_Msg, State) ->
  {noreply, State}.

handle_info({'DOWN', _Ref, process, DeadPid, _Reason}, State=#state{topics = Topics}) ->
  %% remove any topic pointing to DeadPid
  Topics2 = maps:filter(fun(_T, P) -> P =/= DeadPid end, Topics),
  {noreply, State#state{topics = Topics2}};

handle_info(_Info, State) ->
  {noreply, State}.

terminate(_Reason, _State) -> ok.
code_change(_OldVsn, State, _Extra) -> {ok, State}.



unsubscribe(Topic, SubscriberPid) ->
  Pid = ensure_topic(Topic),
  topic_worker:unsubscribe(Pid, SubscriberPid).

request(Topic, CorrId, Payload, RequesterPid) ->
  Pid = ensure_topic(Topic),
  topic_worker:request(Pid, CorrId, Payload, RequesterPid).

reply(Topic, CorrId, Payload) ->
  Pid = ensure_topic(Topic),
  topic_worker:reply(Pid, CorrId, Payload).
