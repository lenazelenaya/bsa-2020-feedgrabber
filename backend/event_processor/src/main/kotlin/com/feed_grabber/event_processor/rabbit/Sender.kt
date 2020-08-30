package com.feed_grabber.event_processor.rabbit

import com.feed_grabber.event_processor.report.dto.ReportFileCreationDto
import com.feed_grabber.event_processor.report.dto.ReportFilesResponseDto
import org.springframework.amqp.rabbit.core.RabbitTemplate

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Component

@Component
class Sender {
    @Value("\${rabbitmq.exchange}")
    private val exchange: String? = null

    @Value("\${rabbitmq.routing-key-response}")
    private val routingKey: String? = null

    @Value("\${rabbitmq.routing-key-report-excel-link}")
    private val excelLinkRoutingKey: String? = null

    @Value("\${rabbitmq.routing-key-report-ppt-link}")
    private val pptLinkRoutingKey: String? = null

    @Autowired
    private val template: RabbitTemplate? = null

    fun send(text: String) {
        println(" [x] Sending...")
        template!!.convertAndSend(exchange!!, routingKey!!, text!!)
        println(" [x] Sent $text")
    }

//    fun sendUploadedReportURL(dto: ReportFileCreationDto) {
//        println(" [x] Sending report generation response for request with id ${dto.requestId}")
//        template!!.convertAndSend(exchange!!, excelLinkRoutingKey!!, dto)
//    }

    fun sendPPTReportURL(dto: ReportFileCreationDto) {
        println(" [x] Sending report generation response for request with id ${dto.requestId}")
        template!!.convertAndSend(exchange!!, pptLinkRoutingKey!!, dto)
    }

    fun sendUploadedReportsURL(dto: ReportFilesResponseDto) {
        println(" [x] Sending report generation response for request with id ${dto.requestId}")
        template!!.convertAndSend(exchange!!, excelLinkRoutingKey!!, dto)
    }

}
