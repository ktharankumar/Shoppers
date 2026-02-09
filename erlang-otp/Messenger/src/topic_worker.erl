%%%-------------------------------------------------------------------
%%% @author ktharnkumar
%%% @copyright (C) 2026, <COMPANY>
%%% @doc
%%%
%%% @end
%%% Created : 09. Jan 2026 20:11
%%%-------------------------------------------------------------------
-module(topic_worker).
-author("ktharnkumar").

-behaviour(gen_server).

%% API
-export([start_link/1, subscribe/2, unsubscribe/2, publish/2,
  request/4, reply/3]).

%% gen_server callbacks
-export([init/1, handle_call/3, handle_cast/2, handle_info/2, terminate/2, code_change/3]).

-record(state, {
  topic,
  subs = #{},        %% SubscriberPid => MonitorRef
  pending = #{}      %% CorrId => RequesterPid
}).

start_link(Topic) ->
  gen_server:start_link(?MODULE, [Topic], []).

subscribe(Pid, SubscriberPid) ->
  gen_server:call(Pid, {subscribe, SubscriberPid}).

unsubscribe(Pid, SubscriberPid) ->
  gen_server:call(Pid, {unsubscribe, SubscriberPid}).

publish(Pid, Payload) ->
  gen_server:cast(Pid, {publish, Payload}).

%% Request/Reply
request(Pid, CorrId, Payload, RequesterPid) ->
  gen_server:cast(Pid, {request, CorrId, Payload, RequesterPid}).

reply(Pid, CorrId, Payload) ->
  gen_server:cast(Pid, {reply, CorrId, Payload}).

init([Topic]) ->
  process_flag(trap_exit, true),
  {ok, #state{topic = Topic}}.

handle_call({subscribe, SubscriberPid}, _From, S=#state{subs = Subs}) ->
  case maps:is_key(SubscriberPid, Subs) of
    true ->
      {reply, ok, S};  %% already subscribed
    false ->
      Ref = erlang:monitor(process, SubscriberPid),
      {reply, ok, S#state{subs = Subs#{SubscriberPid => Ref}}}
  end;

handle_call({unsubscribe, SubscriberPid}, _From, S=#state{subs = Subs}) ->
  case maps:get(SubscriberPid, Subs, undefined) of
    undefined ->
      {reply, ok, S};
    Ref ->
      erlang:demonitor(Ref, [flush]),
      {reply, ok, S#state{subs = maps:remove(SubscriberPid, Subs)}}
  end;

handle_call(_Req, _From, S) ->
  {reply, {error, bad_request}, S}.

handle_cast({publish, Payload}, S=#state{topic = Topic, subs = Subs}) ->
  maps:foreach(fun(SubscriberPid, _Ref) ->
    SubscriberPid ! {topic_event, Topic, Payload}
               end, Subs),
  {noreply, S};

handle_cast({request, CorrId, Payload, RequesterPid}, S=#state{topic = Topic, subs = Subs, pending = Pending}) ->
  %% broadcast request to all subscribers
  maps:foreach(fun(SubscriberPid, _Ref) ->
    SubscriberPid ! {topic_request, Topic, CorrId, Payload}
               end, Subs),
  {noreply, S#state{pending = Pending#{CorrId => RequesterPid}}};

handle_cast({reply, CorrId, Payload}, S=#state{pending = Pending}) ->
  case maps:get(CorrId, Pending, undefined) of
    undefined ->
      {noreply, S};  %% unknown corr id
    RequesterPid ->
      RequesterPid ! {topic_reply, CorrId, Payload},
      {noreply, S#state{pending = maps:remove(CorrId, Pending)}}
  end;

handle_cast(_Msg, S) ->
  {noreply, S}.

handle_info({'DOWN', Ref, process, SubscriberPid, _Reason}, S=#state{subs = Subs, pending = Pending}) ->
  %% remove subscriber if the ref matches
  Subs2 =
    case maps:get(SubscriberPid, Subs, undefined) of
      Ref -> maps:remove(SubscriberPid, Subs);
      _   -> Subs
    end,

  %% also remove any pending requests that were waiting to reply to this dead pid (if requester dies)
  Pending2 = maps:filter(fun(_Corr, ReqPid) -> ReqPid =/= SubscriberPid end, Pending),
  {noreply, S#state{subs = Subs2, pending = Pending2}};

handle_info(_Info, S) ->
  {noreply, S}.

terminate(_Reason, _State) -> ok.
code_change(_OldVsn, State, _Extra) -> {ok, State}.
